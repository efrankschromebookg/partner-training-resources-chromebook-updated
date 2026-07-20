import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  Clock,
  PlayCircle,
  FileText,
  Presentation,
  MonitorPlay,
  Globe,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Library,
  Layout,
  Code,
  Copy,
  Check,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Terminal,
  Download,
  Settings,
  Trash2,
  Command
} from 'lucide-react';
import { DEMO_DATA as LOCAL_DEMO_DATA } from './constants';
import { DemoItem, DemoSource, DemoStatus, DemoType } from './types';

// --- Icon Mappers ---

const getTypeIcon = (type: DemoType) => {
  switch (type) {
    case DemoType.GIF:
      return (
        <div className="flex flex-col items-center gap-0.5" id="icon-demo-type">
          <PlayCircle className="w-4 h-4 text-google-blue" />
          <span className="text-[8px] font-bold text-google-blue uppercase leading-none">Demo</span>
        </div>
      );
    case DemoType.INFOSHEET:
      return (
        <div className="flex flex-col items-center gap-0.5" id="icon-infosheet-type">
          <FileText className="w-4 h-4 text-google-green" />
          <span className="text-[8px] font-bold text-google-green uppercase leading-none">Infosheet</span>
        </div>
      );
    case DemoType.DECK:
      return (
        <div className="flex flex-col items-center gap-0.5" id="icon-slides-type">
          <Presentation className="w-4 h-4 text-google-green" />
          <span className="text-[8px] font-bold text-google-green uppercase leading-none">Slides</span>
        </div>
      );
    case DemoType.VIDEO:
      return (
        <div className="flex flex-col items-center gap-0.5" id="icon-video-type">
          <PlayCircle className="w-4 h-4 text-google-green" />
          <span className="text-[8px] font-bold text-google-green uppercase leading-none">Video</span>
        </div>
      );
    case DemoType.INTERACTIVE:
      return (
        <div className="flex flex-col items-center gap-0.5" id="icon-elearning-type">
          <MonitorPlay className="w-4 h-4 text-google-green" />
          <span className="text-[8px] font-bold text-google-green uppercase leading-none">eLearning</span>
        </div>
      );
    case DemoType.WEBPAGE:
      return (
        <div className="flex flex-col items-center gap-0.5" id="icon-webpage-type">
          <Globe className="w-4 h-4 text-google-blue" />
          <span className="text-[8px] font-bold text-google-blue uppercase leading-none">Web</span>
        </div>
      );
    default: return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

const getFormatLabel = (type: DemoType) => {
  switch (type) {
    case DemoType.GIF: return 'GIF';
    case DemoType.INFOSHEET:
    case DemoType.DECK: return 'PDF';
    case DemoType.VIDEO: return 'MP4';
    case DemoType.INTERACTIVE: return 'SCORM';
    default: return 'WEB';
  }
};

// --- Library Components ---

interface LibraryTableHeaderProps {
}

const LibraryTableHeader: React.FC<LibraryTableHeaderProps> = () => (
  <div className="flex items-center gap-4 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-[#1E1F20] border-b border-gray-800 mb-2" id="library-header">
    <div className="w-8 text-center" id="col-type">Type</div>
    <div className="flex-1" id="col-details">Resource Details</div>
    <div className="w-8 text-right" id="col-link">Link</div>
  </div>
);

interface CompactRowProps {
  item: DemoItem;
  index: number;
}

const CompactRow: React.FC<CompactRowProps & { onEdit?: (item: DemoItem) => void }> = ({ item, index, onEdit }) => {
  const isProduction = item.status === DemoStatus.IN_PRODUCTION;
  const isMarketing = item.source === DemoSource.MARKETING;

  return (
    <div 
      className={`relative group flex items-start gap-3 p-2.5 rounded-xl google-gradient-border transition-all min-h-[64px] ${isMarketing ? 'opacity-70 hover:opacity-100' : ''}`}
      id={`row-${item.id}`}
    >
      <div className="flex-shrink-0 w-8 pt-1 flex justify-center" title={item.type} id={`icon-cell-${item.id}`}>
        {getTypeIcon(item.type)}
      </div>

      <div className="flex-1 min-w-0" id={`details-cell-${item.id}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
          <h3 className={`text-sm font-semibold leading-tight ${isProduction ? 'text-gray-400' : 'text-gray-100'}`} title={item.title} id={`title-${item.id}`}>
            {item.title.includes('CB PLUS') ? (
              <span className="flex items-center gap-1.5">
                <span>{item.title.replace('CB PLUS', '').trim()}</span>
                <span className="flex-shrink-0 text-[9px] font-black text-google-green bg-google-green/10 px-1.5 py-0.5 rounded border border-google-green/20">CB PLUS</span>
              </span>
            ) : item.title}
          </h3>
          {item.featured && <Sparkles className="w-3 h-3 text-google-yellow flex-shrink-0" id={`featured-icon-${item.id}`} />}
          {isProduction && (
            <span className="text-[9px] text-orange-500 font-bold flex items-center gap-1 bg-orange-950/30 px-1.5 py-0.5 rounded flex-shrink-0" id={`status-tag-${item.id}`}>
              <Clock className="w-2.5 h-2.5" /> {item.readyByDate}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-normal mb-2" id={`desc-${item.id}`}>
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2" id={`tags-container-${item.id}`}>
            {item.tags.map(tag => (
              <span key={tag} className="text-[10px] text-google-blue px-2 py-0.5 bg-google-blue/10 rounded border border-google-blue/20">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-2 pt-0.5" id={`actions-${item.id}`}>
        <span className="text-[10px] font-medium text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-700/50">
          {getFormatLabel(item.type)}
        </span>
        
        {onEdit && (
          <button 
            id={`btn-edit-${item.id}`}
            onClick={() => onEdit(item)}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700/50 transition-all"
            title="Edit Searchable Tags"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        {isProduction ? (
          <div className="w-8 h-8 flex items-center justify-center rounded text-gray-700 cursor-not-allowed">
            <AlertCircle className="w-4 h-4" />
          </div>
        ) : (
          <a 
            id={`btn-link-${item.id}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-800/50 hover:bg-google-blue/20 text-gray-400 hover:text-google-blue border border-gray-700/50 hover:border-google-blue/30 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  totalCount: number;
  colorClass: string;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, totalCount, colorClass, isOpen, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex items-center gap-3 px-4 py-3 bg-[#1E1F20] border-y border-gray-800 sticky top-0 z-10 cursor-pointer hover:bg-[#252627] transition-colors select-none group"
    id={`section-header-${title.replace(/\s+/g, '-').toLowerCase()}`}
  >
    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
    <h2 className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{title}</h2>
    
    <div className="flex items-center gap-3 ml-auto">
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Assets ({totalCount})</span>
    </div>
  </div>
);

// --- Library View ---

interface LibraryViewProps {
  isAdmin: boolean;
  initialSearch?: string;
  onExportRequest?: (data: DemoItem[]) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ isAdmin, initialSearch = '', onExportRequest }) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Local Override State
  const [tagOverrides, setTagOverrides] = useState(() => {
    const saved = localStorage.getItem('chromebook_tag_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  const [editingItem, setEditingItem] = useState<DemoItem | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Persist overrides when they change
  useEffect(() => {
    localStorage.setItem('chromebook_tag_overrides', JSON.stringify(tagOverrides));
  }, [tagOverrides]);

  const DEMO_DATA = useMemo(() => {
    return LOCAL_DEMO_DATA.map(item => ({
      ...item,
      tags: tagOverrides[item.id] !== undefined ? tagOverrides[item.id] : item.tags
    }));
  }, [tagOverrides]);

  const categories = [
    'Basics of ChromeOS',
    'Device Portfolio',
    'Gemini',
    'Google Ecosystem'
  ];

  const [sectionsOpen, setSectionsOpen] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: false }), {})
  );

  const types = [
    'All', 
    'Demo (GIF)', 
    'Infosheet (PDF)', 
    'Slide (PDF)', 
    'Video (MP4)', 
    'eLearning (SCORM)'
  ];
  
  const mergedData = useMemo(() => {
    return DEMO_DATA.map(item => ({
      ...item,
      tags: tagOverrides[item.id] !== undefined ? tagOverrides[item.id] : item.tags
    }));
  }, [tagOverrides]);

  const filteredData = useMemo(() => {
    const cleanSearch = search.toLowerCase().trim().startsWith('#') 
      ? search.toLowerCase().trim().substring(1) 
      : search.toLowerCase().trim();

    return mergedData.filter(item => {
      const tags = (item.tags || []).map(t => t.toLowerCase());
      const tools = (item.toolsUsed || []).map(t => t.toLowerCase());
      
      const matchesSearch = 
        item.title.toLowerCase().includes(cleanSearch) || 
        item.description.toLowerCase().includes(cleanSearch) ||
        tools.some(t => t.includes(cleanSearch)) ||
        tags.some(tag => tag.includes(cleanSearch));

      const matchesType = selectedType === 'All' || item.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [search, selectedType, mergedData]);

  const groupedData = useMemo(() => {
    const groups: Record<string, { 
      items: DemoItem[], 
      subGroups: Record<string, { 
        items: DemoItem[], 
        nested?: Record<string, DemoItem[]> 
      }> 
    }> = {};

    categories.forEach(cat => {
      groups[cat] = { items: [], subGroups: {} };
      if (cat === 'Basics of ChromeOS') {
        groups[cat].subGroups = { 
          'Chromebook Basics': { items: [] }, 
          'On-Device Google AI': { items: [] }, 
          'Perks': { items: [] } 
        };
      } else if (cat === 'Gemini') {
        groups[cat].subGroups = { 
          'Gemini Basics': { items: [] }, 
          'Gemini Tools': { items: [] }, 
          'Gemini Trust and Safety': { items: [] } 
        };
      } else if (cat === 'Google Ecosystem') {
        groups[cat].subGroups = { 
          'Service Platforms': { 
            items: []
          }, 
          'Hardware Interoperability': { items: [] } 
        };
      } else if (cat === 'Device Portfolio') {
        groups[cat].subGroups = { 
          'CB Standard': { items: [] }, 
          'CB Plus': { items: [] }, 
          'Googlebook': { items: [] }, 
          'Competition': { items: [] } 
        };
      }
    });

    const sortedFilteredData = [...filteredData].sort((a, b) => {
      // Group by base title (before colon) to keep pairs together
      const baseA = a.title.split(':')[0].trim().toLowerCase();
      const baseB = b.title.split(':')[0].trim().toLowerCase();
      
      if (baseA !== baseB) {
        return baseA.localeCompare(baseB);
      }
      
      // Within the same base resource, prioritize Infosheet first (left side)
      if (a.type === DemoType.INFOSHEET && b.type !== DemoType.INFOSHEET) return -1;
      if (a.type !== DemoType.INFOSHEET && b.type === DemoType.INFOSHEET) return 1;
      
      return a.title.localeCompare(b.title);
    });

    sortedFilteredData.forEach(item => {
      const tools = item.toolsUsed;
      const title = item.title.toLowerCase();
      const desc = item.description.toLowerCase();
      const tags = (item.tags || []).map(t => t.toLowerCase());

      const hasTag = (term: string) => tags.some(t => t.includes(term.toLowerCase()));

      // SPECIAL CASE: Gemini Prompting Guide always goes to Gemini Basics
      if (title.includes('prompting guide')) {
        groups['Gemini'].subGroups['Gemini Basics'].items.push(item);
        return;
      }

      // SPECIAL CASE: The Value of ChromeOS always goes to Chromebook Basics
      if (title.includes('the value of chromeos')) {
        groups['Basics of ChromeOS'].subGroups['Chromebook Basics'].items.push(item);
        return;
      }

      // Priority 0: Competition (Elevated priority)
      if ((title.includes('competition') || title.includes('neo') || title.includes('comparison') || hasTag('competition') || hasTag('comparison') || hasTag('neo')) && !title.includes('plus comparison chart')) {
        if (!groups['Device Portfolio'].subGroups['Competition']) groups['Device Portfolio'].subGroups['Competition'] = {items: []};
        groups['Device Portfolio'].subGroups['Competition'].items.push(item);
        return;
      }

      // Priority 1: Perks
      if (title.includes('perks') || tools.includes('Perks') || hasTag('perks')) {
        groups['Basics of ChromeOS'].subGroups['Perks'].items.push(item);
        return;
      }

      // Priority 2: Device Portfolio & Hardware
      const hardwareTerms = [/\bphone\b/i, /\bfast pair\b/i, /\bandroid\b/i, /\bsharing\b/i, /\binteroperability\b/i, /\btv\b/i, /\bwatch\b/i];
      if ((title.includes('cb plus') || title.includes('plus') || hasTag('plus') || title.includes('aluminum') || desc.includes('aluminum') || title.includes('googlebook') || desc.includes('googlebook') || title.includes('portfolio') || hasTag('portfolio') || hardwareTerms.some(term => term.test(title) || term.test(desc))) && !title.includes('comparison chart') && !title.includes('basics of chromebook elearning')) {
        
        if (title.includes('aluminum') || desc.includes('aluminum') || title.includes('googlebook') || desc.includes('googlebook')) {
          groups['Device Portfolio'].subGroups['Googlebook'].items.push(item);
        } else if (title.includes('plus') || hasTag('plus')) {
          groups['Device Portfolio'].subGroups['CB Plus'].items.push(item);
        } else if (hardwareTerms.some(term => term.test(title) || term.test(desc))) {
           groups['Google Ecosystem'].subGroups['Hardware Interoperability'].items.push(item);
        } else {
          groups['Device Portfolio'].subGroups['CB Standard'].items.push(item);
        }
        return;
      }

      // Priority 3: Specific Gemini Tools
      const geminiToolsList = ['Agent', 'Gems', 'Veo', 'Nano Banana', 'Canvas', 'Extensions', 'Deep Research', 'Sidebar', 'Gemini Notebook'];
      if ((tools.some(t => geminiToolsList.includes(t)) || tools.includes('Gemini Notebook') || geminiToolsList.some(gt => hasTag(gt.toLowerCase()))) && !title.includes('gemini on chromeos')) {
        if (!groups['Gemini'].subGroups['Gemini Tools'].nested) groups['Gemini'].subGroups['Gemini Tools'].nested = {};
        let specificTool = tools.find(t => geminiToolsList.includes(t)) || geminiToolsList.find(gt => hasTag(gt.toLowerCase())) || 'Gemini Notebook';
        if (specificTool === 'Veo' || specificTool === 'Nano Banana') specificTool = 'Nano Banana & Veo';
        
        if (specificTool) {
          if (!groups['Gemini'].subGroups['Gemini Tools'].nested[specificTool]) groups['Gemini'].subGroups['Gemini Tools'].nested[specificTool] = [];
          groups['Gemini'].subGroups['Gemini Tools'].nested[specificTool].push(item);
        } else {
          groups['Gemini'].subGroups['Gemini Tools'].items.push(item);
        }
        return;
      }

      // Priority 4: On-Device Google AI
      if (tools.includes('On-Device Google AI')) {
        groups['Basics of ChromeOS'].subGroups['On-Device Google AI'].items.push(item);
        return;
      }

      // Priority 5: Trust and Safety
      const safetyTerms = ['safety', 'privacy', 'limit', 'support', 'trust', 'security'];
      if (safetyTerms.some(term => title.includes(term) || desc.includes(term)) || hasTag('safety') || hasTag('security') || hasTag('trust')) {
        groups['Gemini'].subGroups['Gemini Trust and Safety'].items.push(item);
        return;
      }

      // Priority 6: Basics (Chromebook Basics)
      if ((title.includes('basics') || hasTag('basics') || title.includes('the value of chromeos') || title.includes('plus comparison chart') || title.includes('basics of chromebook elearning')) && !title.includes('gemini on chromeos')) {
        groups['Basics of ChromeOS'].subGroups['Chromebook Basics'].items.push(item);
        return;
      }

      // Priority 7: Gemini Basics
      if (title.includes('gemini') || desc.includes('gemini') || tools.includes('Gemini')) {
        groups['Gemini'].subGroups['Gemini Basics'].items.push(item);
        return;
      }

      // Fallback: Ecosystem / Other
      const workspaceApps = ['Sheets', 'Slides', 'Docs', 'Gmail', 'Calendar', 'Google Meet', 'Google Workspace Tools'];
      if (tools.some(t => workspaceApps.includes(t))) {
        groups['Google Ecosystem'].subGroups['Service Platforms'].items.push(item);
        return;
      }
      groups['Basics of ChromeOS'].subGroups['Chromebook Basics'].items.push(item);
    });

    // Ensure "Learning with Gemini Notebook" is at the bottom of the "Gemini Notebook" list if it exists
    if (groups['Gemini']?.subGroups['Gemini Tools']?.nested?.['Gemini Notebook']) {
      const list = groups['Gemini'].subGroups['Gemini Tools'].nested['Gemini Notebook'];
      const targets: typeof list = [];
      const remaining: typeof list = [];
      
      list.forEach(item => {
        if (item.title.toLowerCase().includes('learning with gemini notebook')) {
          targets.push(item);
        } else {
          remaining.push(item);
        }
      });
      groups['Gemini'].subGroups['Gemini Tools'].nested['Gemini Notebook'] = [...remaining, ...targets];
    }

    // Ensure "Gemini Study Tips" and "Back to School with Gemini" are at the bottom of the "Gemini Basics" subcategory
    if (groups['Gemini']?.subGroups['Gemini Basics']?.items) {
      const list = groups['Gemini'].subGroups['Gemini Basics'].items;
      const targets: typeof list = [];
      const remaining: typeof list = [];
      
      list.forEach(item => {
        const lowerTitle = item.title.toLowerCase();
        if (lowerTitle.includes('gemini study tips') || lowerTitle.includes('back to school with gemini')) {
          targets.push(item);
        } else {
          remaining.push(item);
        }
      });
      groups['Gemini'].subGroups['Gemini Basics'].items = [...remaining, ...targets];
    }

    return groups;
  }, [filteredData, categories]);

  const [subSectionsOpen, setSubSectionsOpen] = useState({
    'Chromebook Basics': false,
    'On-Device Google AI': false,
    'Gemini Basics': false,
    'Gemini Tools': false,
    'Gemini Trust and Safety': false,
    'Service Platforms': false,
    'Hardware Interoperability': false,
    'CB Standard': false,
    'CB Plus': false,
    'Googlebook': false
  });

  const sectionColors = [
    'text-google-blue',
    'text-google-green',
    'text-google-red',
    'text-google-yellow'
  ];

  const handleUpdateLocalTags = () => {
    if (!editingItem) return;
    const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    setTagOverrides(prev => ({
      ...prev,
      [editingItem.id]: newTags
    }));
    setEditingItem(null);
  };

  const handleResetTags = () => {
    if (confirm('Clear all your locally modified tags? This will return the library to the default state.')) {
      setTagOverrides({});
      localStorage.removeItem('chromebook_tag_overrides');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-4 px-4 md:px-6" id="library-view-container">
      {/* Search & Filters */}
      <div className="sticky top-0 z-40 bg-[#131314]/90 backdrop-blur pb-4 pt-6" id="search-sticky">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-google-blue" />
            </div>
            <input
              id="search-input"
              type="text"
              className="block w-full pl-9 pr-3 py-2 bg-[#1E1F20] border border-gray-700 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all"
              placeholder="Search by title, description, or tool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isAdmin && (
             <div className="flex gap-2">
                <button 
                  onClick={() => onExportRequest?.(DEMO_DATA)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-google-green/10 hover:bg-google-green/20 text-google-green border border-google-green/20 rounded-md text-xs font-medium transition-all"
                  id="btn-export-code"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Source</span>
                </button>
                <button 
                  onClick={handleResetTags}
                  className="p-2 bg-gray-800 hover:bg-google-red/10 text-gray-400 hover:text-google-red border border-gray-700 rounded-md transition-all"
                  title="Reset all tags"
                  id="btn-reset-tags"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
          )}
        </div>

        <div className="flex items-center gap-4 py-2 text-xs border-t border-b border-gray-800 overflow-x-auto no-scrollbar" id="filter-bar">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter className="w-3 h-3" />
            </div>
            <select 
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent border-none text-gray-300 focus:ring-0 cursor-pointer hover:text-white"
            >
              {types.map(t => <option key={t} value={t} className="bg-[#1E1F20]">{t === 'All' ? 'All Formats' : t}</option>)}
          </select>

          <div className="ml-auto" />
        </div>
      </div>

      <div className="space-y-4 mt-4" id="sections-container">
        {categories.map((cat, index) => {
          const group = groupedData[cat];
          const demos = group?.items || [];
          const subGroups = (group?.subGroups || {}) as Record<string, { items: DemoItem[], nested?: Record<string, DemoItem[]> }>;
          
          const subGroupEntries = Object.entries(subGroups).sort(([a], [b]) => {
            if (cat === 'Device Portfolio') {
              const order = ['CB Standard', 'CB Plus', 'Googlebook', 'Competition'];
              return order.indexOf(a) - order.indexOf(b);
            }
            return a.localeCompare(b);
          });

          const hasSubGroups = subGroupEntries.length > 0;
          const totalCount = demos.length + subGroupEntries.reduce((acc: number, [_, sub]) => acc + sub.items.length + (sub.nested ? Object.values(sub.nested).reduce((nAcc, nList) => nAcc + nList.length, 0) : 0), 0);
          const isSearching = search.trim().length > 0;
          
          if (totalCount === 0 && isSearching) return null;

          const isOpen = sectionsOpen[cat] || isSearching;
          
          return (
            <div key={cat} className="rounded-lg overflow-hidden border border-gray-800" id={`cat-box-${cat.replace(/\s+/g, '-').toLowerCase()}`}>
              <SectionHeader 
                title={cat} 
                totalCount={totalCount}
                colorClass={sectionColors[index % sectionColors.length]} 
                isOpen={isOpen}
                onToggle={() => setSectionsOpen(prev => ({...prev, [cat]: !prev[cat]}))}
              />
              {isOpen && (
                <div className="bg-[#131314] p-3">
                  {demos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {demos.map((item, idx) => (
                        <CompactRow 
                          key={item.id} 
                          item={item} 
                          index={idx} 
                          onEdit={isAdmin ? (item) => {
                            setEditingItem(item);
                            setTagInput(item.tags?.join(', ') || '');
                          } : undefined}
                        />
                      ))}
                    </div>
                  )}
                  
                  {hasSubGroups && (
                    <div className="space-y-2">
                      {subGroupEntries.filter(([_, sub]) => !isSearching || (sub.items.length > 0 || (sub.nested && Object.values(sub.nested).some(l => l.length > 0)))).map(([subCat, subData]) => {
                        const isSubOpen = subSectionsOpen[subCat] || isSearching;
                        return (
                          <div key={subCat} className="border border-gray-800/50 rounded-lg overflow-hidden">
                            <div 
                              onClick={() => setSubSectionsOpen(prev => ({...prev, [subCat]: !prev[subCat]}))}
                              className="flex items-center gap-2 px-4 py-2 bg-[#18191A] hover:bg-[#1E1F20] cursor-pointer transition-colors group"
                            >
                              {isSubOpen ? <ChevronDown className="w-3 h-3 text-gray-600" /> : <ChevronRight className="w-3 h-3 text-gray-600" />}
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300">{subCat}</span>
                              <span className="text-[9px] text-gray-700 ml-auto font-mono">({subData.items.length + (subData.nested ? Object.values(subData.nested).reduce((acc, l) => acc + l.length, 0) : 0)})</span>
                            </div>
                            
                            {isSubOpen && (
                              <div className="bg-[#131314] p-3 space-y-3">
                                {subData.items.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {subData.items.map((item, idx) => (
                                      <CompactRow 
                                        key={item.id} 
                                        item={item} 
                                        index={idx}
                                        onEdit={isAdmin ? (item) => {
                                          setEditingItem(item);
                                          setTagInput(item.tags?.join(', ') || '');
                                        } : undefined}
                                      />
                                    ))}
                                  </div>
                                )}
                                
                                {subData.nested && Object.entries(subData.nested).sort(([a], [b]) => a.localeCompare(b)).map(([nestedTitle, nestedItems]) => {
                                  const isNestedOpen = subSectionsOpen[nestedTitle] || isSearching;
                                  return (
                                    <div key={nestedTitle} className="border border-gray-800/30 rounded-lg overflow-hidden ml-2">
                                      <div 
                                        onClick={() => setSubSectionsOpen(prev => ({...prev, [nestedTitle]: !prev[nestedTitle]}))}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1C1D1E] hover:bg-[#202122] cursor-pointer transition-colors group"
                                      >
                                        {isNestedOpen ? <ChevronDown className="w-2.5 h-2.5 text-gray-600" /> : <ChevronRight className="w-2.5 h-2.5 text-gray-600" />}
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300">{nestedTitle}</span>
                                        <span className="text-[8px] text-gray-700 ml-auto font-mono">({nestedItems.length})</span>
                                      </div>
                                      
                                      {isNestedOpen && (
                                        <div className="bg-[#111112] p-2">
                                          {nestedItems.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                              {nestedItems.map((item, idx) => (
                                                <CompactRow 
                                                  key={item.id} 
                                                  item={item} 
                                                  index={idx}
                                                  onEdit={isAdmin ? (item) => {
                                                    setEditingItem(item);
                                                    setTagInput(item.tags?.join(', ') || '');
                                                  } : undefined}
                                                />
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="py-2 text-[9px] text-gray-600 italic text-center">No resources available in this section.</div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {subData.items.length === 0 && (!subData.nested || Object.values(subData.nested).every(l => l.length === 0)) && (
                                  <div className="py-4 text-[10px] text-gray-600 italic text-center">No resources available yet.</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {totalCount === 0 && !hasSubGroups && (
                    <div className="px-8 py-8 text-center" id="empty-cat-msg">
                      <p className="text-xs text-gray-600">No resources found in this category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20" id="no-results">
          <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <h3 className="text-gray-400 font-medium">No results found for "{search}"</h3>
        </div>
      )}

      {/* Tag Management Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="modal-tags">
          <div className="bg-[#1E1F20] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-google-blue/10 rounded-lg">
                <Settings className="w-5 h-5 text-google-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Manage Metadata</h3>
                <p className="text-xs text-gray-400 truncate max-w-[280px]">{editingItem.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Searchable Tags (comma separated)
                </label>
                <input
                  id="tag-input-modal"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full bg-[#131314] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-google-blue transition-all"
                  placeholder="e.g. mobile, student, chromebook plus..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateLocalTags()}
                />
                <p className="mt-2 text-[10px] text-gray-500 leading-relaxed italic">
                  Changes are currently saved to your browser session. Use "Export Source" when finished to make them permanent in the code.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="btn-cancel-tags"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-tags"
                  onClick={handleUpdateLocalTags}
                  className="flex-1 bg-google-blue hover:bg-google-blue/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-google-blue/20"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App Shell ---

export default function App() {
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCode, setExportCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Developer Toggle

  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Dynamically set the base URL from the current location
    setBaseUrl(window.location.origin);
  }, []);

  const sharedUrl = baseUrl || "https://ais-pre-hkuxfwguhtk2ygzob74iwp-71841977985.us-east1.run.app";
  const embedCode = `<iframe src="${sharedUrl}/embed.html" width="100%" height="800px" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`;
  const csvUrl = `${sharedUrl}/chatbot_resources.csv`;
  const sheetsFormula = `=IMPORTDATA("${csvUrl}")`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportRequest = (data: DemoItem[]) => {
    // Generate a clean JSON block for constants.ts
    const exportString = JSON.stringify(data, null, 2);
    setExportCode(exportString);
    setShowExportModal(true);
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#E8EAED] font-sans flex flex-col" id="app-shell">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#131314]/80 backdrop-blur border-b border-gray-800" id="navbar">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
               <img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/gemini-color.png" alt="Gemini Logo" className="w-8 h-8" />
            </div>
            <span className="font-semibold text-white tracking-tight text-lg">Chromebook Training Resources Library</span>
          </div>

          <div className="flex items-center gap-2">
          </div>
        </div>
      </nav>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="modal-export">
          <div className="bg-[#1E1F20] border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#252627]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-google-green" />
                <h3 className="font-semibold text-white">Export Updated Constants</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-white">
                <ChevronDown className="w-6 h-6 rotate-180" />
              </button>
            </div>
            <div className="p-6 flex-grow overflow-hidden flex flex-col">
              <div className="mb-4 p-3 bg-google-green/10 border border-google-green/20 rounded-lg">
                <p className="text-xs text-google-green leading-relaxed">
                  <strong>Success!</strong> Your tag modifications have been merged into the library data. 
                  Below is the JSON representation of the updated `DEMO_DATA`. Copy this block and paste it 
                  into your code to make these tags permanent for all users.
                </p>
              </div>
              <div className="relative flex-grow overflow-auto">
                <pre className="h-full bg-[#131314] p-4 rounded-xl border border-gray-800 text-[10px] text-gray-400 overflow-auto font-mono">
                  {exportCode}
                </pre>
                <button 
                  id="btn-copy-export"
                  onClick={() => copyToClipboard(exportCode)}
                  className="absolute top-4 right-4 px-3 py-1.5 bg-google-green hover:bg-google-green/90 text-white rounded-lg transition-all shadow-lg flex items-center gap-2 text-xs font-bold"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <p className="mt-4 text-[10px] text-gray-500 text-center italic">
                Note: This export contains the flat array of all assets. It is recommended to update your `constants.ts` logic or simply replace the `DEMO_DATA` export at the bottom.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-4">
        <LibraryView isAdmin={isAdmin} onExportRequest={handleExportRequest} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto py-6 text-center" id="footer">
        <p className="text-sm text-white mb-2">
          Please reach out to Emily Franks (<a href="mailto:frankse@google.com" className="text-google-blue hover:underline">frankse@</a>) for the exhaustive demo list or to request additional content or demos.
        </p>
        <p className="text-xs text-gray-600">
          Internal Use Only • CrOS Training & Enablement • Confidential
        </p>
      </footer>
    </div>
  );
}
