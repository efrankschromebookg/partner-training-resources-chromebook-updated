import { DemoItem, DemoSource, DemoStatus, DemoType, UpdateItem, ToolReference } from './types';

// --- Text Helpers ---

const toTitleCase = (str: string) => {
  let formatted = str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Specific corrections
  formatted = formatted
    .replace(/Gemini/gi, 'Gemini')
    .replace(/\bAi\b/gi, 'AI') // Capitalize standalone AI
    .replace(/Non-Ai/gi, 'Non-AI') // Fix (Non-AI)
    .replace(/Cb/g, 'CB')
    .replace(/CB Plus/gi, 'CB PLUS')
    .replace(/Pc/g, 'PC')
    .replace(/Llm/g, 'LLM')
    .replace(/\bTv\b/g, 'TV')
    .replace(/\bYoutube\b/g, 'YouTube')
    .replace(/\bWifi\b/g, 'Wi-Fi')
    .replace(/Geforce Now/gi, 'GeForce NOW') // Correct casing
    .replace(/Chromeos/gi, 'ChromeOS') // Fix ChromeOS casing
    .replace(/Chrome Os/gi, 'ChromeOS') // Fix Chrome OS to ChromeOS
    .replace(/Notebooklm/gi, 'NotebookLM') // Fix NotebookLM casing
    .replace(/\bB2s\b/gi, 'B2S') // Fix B2S casing
    .replace(/Imagen/gi, 'Nano Banana'); // Rename Imagen to Nano Banana

  return formatted;
};

const cleanDescription = (str: string) => {
  let cleaned = str.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
  // Ensure "AI" is capitalized in descriptions
  cleaned = cleaned.replace(/\bai\b/gi, 'AI');
  cleaned = cleaned.replace(/Geforce Now/gi, 'GeForce NOW');
  cleaned = cleaned.replace(/Chromeos/gi, 'ChromeOS');
  cleaned = cleaned.replace(/Chrome Os/gi, 'ChromeOS');
  cleaned = cleaned.replace(/Notebooklm/gi, 'NotebookLM');
  cleaned = cleaned.replace(/Imagen/gi, 'Nano Banana');

  if (cleaned.length > 0 && !cleaned.endsWith('.') && !cleaned.endsWith(')') && !cleaned.toLowerCase().includes('did you know series')) {
    cleaned += '.';
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const detectTool = (title: string, desc: string): string[] => {
  const t = (title + ' ' + desc).toLowerCase();
  const tools = [];
  if (t.includes('veo')) tools.push('Veo');
  if (t.includes('extensions:')) tools.push('Extensions');
  if (t.includes('canvas')) tools.push('Canvas');
  // Map 'imagen' keywords to Nano Banana
  if (t.includes('imagen') || t.includes('image generation') || t.includes('nano banana')) tools.push('Nano Banana');
  if (t.includes('deep research')) tools.push('Deep Research');
  
  if (t.includes('help me write')) {
    if (t.includes('quick insert')) tools.push('On-Device Google AI');
    else tools.push('Help Me Write');
  }
  if (t.includes('help me read')) {
    tools.push('On-Device Google AI');
  }
  
  // Specific detections for Agent and Gems
  if (t.includes('agent')) tools.push('Agent');
  if (t.includes('gem:') || t.includes('gem ') || t.includes('gems')) tools.push('Gems');
  if (t.includes('notebooklm')) tools.push('NotebookLM');
  if (t.includes('sidebar')) tools.push('Sidebar');

  if (t.includes('lens') || t.includes('select to search')) {
    if (t.includes('text capture') || t.includes('shopping')) tools.push('On-Device Google AI');
    else tools.push('Google Lens');
  }
  if (t.includes('magic eraser') || t.includes('photos')) tools.push('Google Photos');
  // Specific check for Google Meet to avoid false positives with "time to meet"
  if (t.includes('google meet')) tools.push('Google Meet');
  if (t.includes('slides') || t.includes('slide') || t.includes('presentation')) tools.push('Slides');
  if ((t.includes('sheets') || t.includes('sheet') || t.includes('spreadsheet') || t.includes('budget')) && !t.includes('infosheet')) tools.push('Sheets');
  if (t.includes('docs') || t.includes('doc') || t.includes('document')) {
    if (!t.includes('infosheet')) tools.push('Docs');
  }
  if (t.includes('gmail') || t.includes('email')) tools.push('Gmail');
  if (t.includes('calendar')) tools.push('Calendar');
  if (t.includes('workspace')) tools.push('Google Workspace Tools');
  // Removed Maps detection per request
  // Removed YouTube detection per request
  if (t.includes('translate')) {
    if (t.includes('live translate')) tools.push('On-Device Google AI');
    else tools.push('Google Workspace Tools');
  }
  if (t.includes('perks') || t.includes('perk')) tools.push('Perks');
  if (t.includes('quick insert') || t.includes('smart tab grouping')) tools.push('On-Device Google AI');
  if (t.includes('face control')) tools.push('On-Device Google AI');
  
  // Specific override for Gemini Agent Infosheet
  if (title.toLowerCase().includes('gemini agent infosheet')) {
    return ['Agent'];
  }
  
  // If no tools detected but Gemini is mentioned, add Gemini
  if (tools.length === 0 && t.includes('gemini')) {
    tools.push('Gemini');
  }
  
  return tools.length > 0 ? tools : ['Gemini'];
};

const parseStatusAndDate = (title: string): { cleanTitle: string, status: DemoStatus, date?: string } => {
  // Supports "Ready by 12/13" and "Ready by TBD"
  const readyByRegex = /Ready by ([\d\/]+|TBD)/i;
  const match = title.match(readyByRegex);
  
  let cleanTitle = title.replace(readyByRegex, '').replace(/\n/g, '').replace(/\*/g, '').trim();
  cleanTitle = cleanTitle.replace(/^"|"$/g, ''); // Remove quotes
  
  if (match) {
    return {
      cleanTitle: cleanTitle,
      status: DemoStatus.IN_PRODUCTION,
      date: match[1]
    };
  }
  return {
    cleanTitle: cleanTitle,
    status: DemoStatus.LIVE
  };
};

// --- Data Source 1: Chatbot Project (CSV Row Based) ---

// Mapped from user CSV: Title, Link, Description, Use Case, Profile
const rawChatbotData = [
  { t: "Gemini Agent: Infosheet", l: "https://drive.google.com/file/d/1Vrfl7dFMj6k0VQUkSAMqrXSBG8C_19hj/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "agent, agentic support, gemini", p: "", type: DemoType.INFOSHEET },
  { t: "Gemini Agent: Video", l: "https://drive.google.com/file/d/1Q3H1fWzvQkj2ZGsC2LkHAzZY_oTBd60p/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "agent, agentic support, gemini", p: "Everyday user", type: DemoType.VIDEO },
  { t: "Gemini Gems: Infosheet", l: "https://drive.google.com/file/d/1HgUO0ywQgTKGEv40ONPrNKiF12WGsi_h/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "gems, custom gem, creation, gemini", p: "Everyday user", type: DemoType.INFOSHEET },
  { t: "Gemini Gems: Video", l: "https://drive.google.com/file/d/1s--Kiuqe9ErNNSwDth9JbIZxZmtS-H2j/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "gems, custom gem, creation, gemini", p: "Everyday user", type: DemoType.VIDEO },
  { t: "Nano Banana & Veo: Infosheet", l: "https://drive.google.com/file/d/17T41i7XDPxgmkGX8BV-ubtd28Pz5EMMt/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "nano banana, veo, gen AI, generative, image, video, design, creativity", p: "Everyday user", type: DemoType.INFOSHEET },
  { t: "Nano Banana & Veo: Video", l: "https://drive.google.com/file/d/14uiuROn1Xsyz36CySa48e2_1dkK1sudW/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "nano banana, veo, gen AI, generative, image, video, design, creativity", p: "Everyday user", type: DemoType.VIDEO },
  { t: "Deep Research: Infosheet", l: "https://drive.google.com/file/d/14dOvx8J5hrrihvDZHUiML_1hbKJvJ2jm/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "deep research, learning, gemini", p: "Everyday user", type: DemoType.INFOSHEET },
  { t: "Canvas: Infosheet", l: "https://drive.google.com/file/d/18kMYciYx1bypGyHua24VtcKWSNGzHGS_/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "gemini, canvas, design, visual", p: "Everyday user", type: DemoType.INFOSHEET },
  { t: "Deep Research & Canvas: Video", l: "https://drive.google.com/file/d/1BeVq48oxNmSSMV0UXlqYlBugrKRRc1-K/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "gemini, canvas, design, visual, deep research, learning", p: "Everyday user", type: DemoType.VIDEO },
  { t: "NotebookLM Audio & Video Overview: Video", l: "https://drive.google.com/file/d/19L5PWHON_pl5W7Fspvv3F2F95jiDHfmD/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "notebooklm, learning, productivity, video, audio, overview", p: "", type: DemoType.VIDEO },
  { t: "NotebookLM Audio & Video Overview: Infosheet", l: "https://drive.google.com/file/d/1jU-ssm4VbZTDSqTo8y3YBwp4flxM-9Jt/view?usp=drive_link", d: "Did You Know Series (2026)", tags: "notebooklm, learning, productivity, video, audio, overview", p: "", type: DemoType.INFOSHEET },
  { t: "Gemini on ChromeOS: Infosheet", l: "https://drive.google.com/file/d/1qRIu0Md0LKw87Z_eZIw7oPprBbP3lPB7/view?usp=sharing", d: "Overview of Gemini features and integration on ChromeOS.", tags: "Gemini, foundation, introduction, demos, integration, Workspace tools", p: "General", type: DemoType.INFOSHEET },
  { t: "Gemini Sidebar in Chrome", l: "https://drive.google.com/file/d/1kH2RETW6jvtuFcdpcHUG5uaCATeQ5n-h/view?usp=sharing", d: "Demo showing the Gemini sidebar experience in the Chrome browser.", tags: "gemini tools, sidebar, gemini in chrome, chrome browser, agent, agentic support", p: "General", type: DemoType.INFOSHEET },
  { t: "The Value of ChromeOS", l: "https://drive.google.com/file/d/1l4U5fijAeRYGzms1h_ywAtjmBmx4Gg_u/view?usp=sharing", d: "A video overview highlighting the core value proposition and benefits of ChromeOS.", tags: "foundations, chromebook, chromeOS, perks, offers, value", p: "General", type: DemoType.VIDEO },
  { t: "What's New with NotebookLM eModule (Spring '26)", l: "https://drive.google.com/file/d/1fjyvN1kZMD-wXbZ80Tbn__sMp6eluGWa/view?usp=drive_link", d: "Interactive eLearning module covering the latest updates to NotebookLM.", tags: "notebooklm, learning, productivity, video, audio, overview, infographics, mind map, slide output, sources", p: "Internal", type: DemoType.INTERACTIVE },
  { t: "Basics of Chromebook eLearning", l: "https://drive.google.com/file/d/1vqxuEP86YfPGeYdyyCt9OmtfSfqvICeg/view?usp=sharing", d: "15 minute foundational eLearning for baseline Chromebook knowledge. Partners without an eLearning platform can view the module through the Articulate web player link here: https://share.articulate.com/s7w053UVQ07i08mKhOGHn", tags: "foundations, chromebook, chromebook plus, chromeOS, introduction", p: "General", type: DemoType.INTERACTIVE },
  { t: "Google Brand Familiarity", l: "https://drive.google.com/file/d/1jrd8I0U0ZcjKSC37wHUCEMqYdv2UcOPn/view?usp=sharing", d: "A guide to understanding Google's brand ecosystem and workspace familiarity.", tags: "google workspace, youtube, gmail, photos, android, ecosystem, beto, better together", p: "General", type: DemoType.VIDEO },
  { t: "Better Together with Gemini", l: "https://drive.google.com/file/d/1gtjxJ-dFpJv0nZxqSob-G_mKsT5NE0dh/view?usp=sharing", d: "Explore hardware interoperability and how devices work better together with Gemini.", tags: "hardware, interoperability, gemini, better together, beto, ecosystem", p: "General", type: DemoType.INFOSHEET },
  { t: "Gemini Prompting Guide: Demos", l: "https://docs.google.com/presentation/d/1PdXqbPeZ-yYs6qm0_MdpAO7C2rq7pU3MKBw-VVxdloY/edit?usp=sharing", d: "A comprehensive slide deck covering Gemini prompting techniques and live demo scenarios.", tags: "Gemini, prompting, canvas, deep research, storybook, guided learning, gems, image, video, generation, nano banana, veo, gen AI", p: "General", type: DemoType.DECK },
  { t: "Back to School with Gemini: In-Store Demos (B2S 2026)", l: "https://drive.google.com/file/d/103BXHaTJ2ibpOCafj5XkUtmmvxsvUDR7/view?usp=sharing", d: "Back to School with Gemini in-store live product demo scenarios and presentation guide.", tags: "B2S, Back to School, EDU, Classroom, Students, Study, Google AI", p: "General", type: DemoType.INFOSHEET },
  { t: "Gemini Study Tips (B2S 2026)", l: "https://drive.google.com/file/d/1ADEH38FYSXrZaNXKf7BX2-WOzxZVpQTm/view?usp=sharing", d: "Partners without an eLearning platform can view the module through the Articulate web player link here: https://share.articulate.com/XuFSGPMpYGdQF8fTEOdAq", tags: "B2S, Back to School, EDU, Classroom, Students, Study, Google AI, Productivity", p: "General", type: DemoType.INTERACTIVE },
  { t: "Learning with NotebookLM (B2S 2026)", l: "https://drive.google.com/file/d/1fjyvN1kZMD-wXbZ80Tbn__sMp6eluGWa/view", d: "Partners without an eLearning platform can view the module through the Articulate web player link here: https://share.articulate.com/efQ7VBllQjLyHA19mDX_0", tags: "B2S, Back to School, EDU, Classroom, Students, Productivity, NotebookLM, Notebooks, New", p: "General", type: DemoType.INTERACTIVE }

];

export const CHATBOT_DEMOS: DemoItem[] = rawChatbotData.map((item, index) => {
  const { cleanTitle, status, date } = parseStatusAndDate(item.t);
  
  // Clean Profile: Remove quotes, replace newlines with ' & '
  let profile = item.p.replace(/^"|"$/g, '').replace(/\n/g, ' & ');
  if (profile === 'Family') profile = 'Family (Shared Device)';
  
  // Clean Link: Check for valid URL
  const isValidUrl = item.l && (item.l.startsWith('http') || item.l.startsWith('www'));
  
  // PRIORITY LOGIC: If a valid URL exists, it is LIVE regardless of what the title regex said.
  let finalStatus = status;
  let finalDate = date;

  if (isValidUrl) {
    finalStatus = DemoStatus.LIVE;
    finalDate = undefined; // Resource is ready, no countdown needed.
  } else {
    // If no URL, force In Production if it wasn't already determined by title
    finalStatus = DemoStatus.IN_PRODUCTION;
    if (!finalDate) finalDate = 'TBD';
  }

  // --- SPECIALIZED CHATBOT TOOL MAPPING ---
  let tools = detectTool(cleanTitle, item.d);
  
  // Rule 3: Special case for Server Mapping
  if (cleanTitle.toLowerCase().includes('server mapping')) {
    tools = ['Gemini'];
  } else {
    tools = tools.map(tool => {
      // Rule 1: Lens -> On-Device Google AI
      if (tool === 'Google Lens') return 'On-Device Google AI';
      // Rule 2: Workspace apps -> Google Workspace Tools (Selective)
      const workspaceApps = ['Sheets', 'Slides', 'Docs', 'Gmail', 'Calendar', 'Google Meet'];
      if (workspaceApps.includes(tool)) return tool;
      
      if (['Help Me Read', 'Help Me Write', 'Quick Insert', 'Google Photos', 'Live Translate', 'Smart Tab Grouping'].includes(tool)) {
        return 'On-Device Google AI';
      }
      if (tool === 'Google Workspace Tools') return 'Google Workspace Tools';
      if (tool === 'Gems') return 'Gems';
      return tool;
    });
  }
  
  // Deduplicate tools after mapping
  let finalTools = Array.from(new Set(tools));

  // If a specific workspace app is present, remove the generic "Google Workspace Tools"
  const hasSpecificApp = finalTools.some(t => ['Sheets', 'Slides', 'Docs', 'Gmail', 'Calendar', 'Google Meet'].includes(t));
  if (hasSpecificApp) {
    finalTools = finalTools.filter(t => t !== 'Google Workspace Tools');
  }

  // NEW RULE: If both exist, keep only On-Device Google AI
  if (finalTools.includes('Gemini') && finalTools.includes('On-Device Google AI')) {
    finalTools = finalTools.filter(t => t !== 'Gemini');
  }

  return {
    id: `cb-${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: toTitleCase(cleanTitle), // Apply uniform capitalization
    description: cleanDescription(item.d),
    url: isValidUrl ? item.l : '#', 
    source: DemoSource.CHATBOT_PROJECT,
    status: finalStatus,
    readyByDate: finalDate,
    useCase: item.tags.split(',')[0].trim(), // Take primary tag
    profile: profile,
    type: (item as any).type || DemoType.GIF, 
    toolsUsed: finalTools,
    tags: item.tags ? item.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
    featured: false,
  };
}).sort((a, b) => {
  // Sort so that IN_PRODUCTION items are always at the bottom
  if (a.status === DemoStatus.LIVE && b.status !== DemoStatus.LIVE) return -1;
  if (a.status !== DemoStatus.LIVE && b.status === DemoStatus.LIVE) return 1;
  return 0;
});

// --- Data Source 2: AI Experience Program ---

const aiExpCleanData = [];

const AI_EXPERIENCE_DEMOS: DemoItem[] = aiExpCleanData.map((item, index) => ({
  id: `aiexp-${index}`,
  title: toTitleCase(item.t),
  description: cleanDescription(item.d),
  url: item.l,
  source: DemoSource.AI_EXPERIENCE,
  status: DemoStatus.LIVE,
  useCase: item.uc,
  profile: item.p,
  type: DemoType.INFOSHEET,
  toolsUsed: detectTool(item.t, item.d),
  tags: [],
}));

// --- Data Source 3: Did You Know Series ---

const DYK_SERIES_DEMOS: DemoItem[] = [];

// --- Data Source 4: Event Demos ---

const EVENT_DEMOS: DemoItem[] = [];

// --- Data Source 4: Marketing & GTE ---

const MARKETING_DEMOS: DemoItem[] = [];

// --- Data Source 5: Official Sources ---

export const OFFICIAL_SOURCES_DATA: DemoItem[] = [
  {
    id: 'off-6',
    title: 'Chromebook vs Neo Comparison Guide (USD)',
    description: 'A comprehensive guide comparing Chromebook capabilities with the Neo competitor model (US Version).',
    url: 'https://drive.google.com/file/d/1KkkQSN5I7oGPJeO-MTxpr0OKQK_LbC7G/view?usp=sharing',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Competition',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Competition'],
    tags: ['competition', 'compete', 'macbook', 'neo', 'apple'],
  },
  {
    id: 'off-6-cad',
    title: 'Chromebook vs Neo Comparison Guide (CAD)',
    description: 'A comprehensive guide comparing Chromebook capabilities with the Neo competitor model (Canada).',
    url: 'https://drive.google.com/file/d/1Rx7Gk6e1KKlMu9iIZG_HeT7nKfrswJRW/view?usp=sharing&resourcekey=0-MhQXfNFVUkEu27Ya5j525w',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Competition',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Competition'],
    tags: ['competition', 'compete', 'macbook', 'neo', 'apple'],
  },
  {
    id: 'off-7',
    title: 'Chromebook Standard Portfolio Guide',
    description: 'Detailed overview of the standard Chromebook device portfolio.',
    url: 'https://drive.google.com/file/d/1lDLIop1wrP-cPIc8mTTM19d5SQeJEKuU/view?usp=sharing',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Device Portfolio',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Device Portfolio'],
    tags: ['portfolio', 'standard', 'hardware'],
  },
  {
    id: 'off-8',
    title: 'Chromebook Plus Portfolio Guide',
    description: 'Detailed overview of the high-performance Chromebook Plus device portfolio.',
    url: 'https://drive.google.com/file/d/1M4FIKGyRm0vak6ie-16ndb5E28MKd1/view?usp=sharing',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Device Portfolio',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Device Portfolio', 'CB Plus'],
    tags: ['portfolio', 'plus', 'hardware', 'advantage'],
  },
  {
    id: 'off-9',
    title: 'Google AI Pro Perk (USD)',
    description: 'Learn about the exclusive perks and offers available to Chromebook users.',
    url: 'https://drive.google.com/file/d/1xdTWgnnK0kc_eBnZ777Kd3Lnu13EZYD5/view?usp=drive_link',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Basics of ChromeOS',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Perks'],
    tags: ['perks', 'google ai pro', 'US', 'basics', '5TB', 'value', 'offers', 'extras'],
  },
  {
    id: 'off-10',
    title: 'Chromebook Plus Comparison Chart',
    description: 'A detailed comparison chart for Chromebook Plus devices.',
    url: 'https://drive.google.com/file/d/1_B7d190WjWSxDW94BqSJ-2LG3GkAo3Ws/view?usp=drive_link',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Basics of ChromeOS',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Basics of ChromeOS'],
    tags: ['comparison', 'chart', 'plus', 'standard', 'hardware'],
  },
  {
    id: 'off-11',
    title: 'Help Me Read',
    description: 'Demo of the AI-powered Help Me Read feature on Chromebook.',
    url: 'https://drive.google.com/file/d/1qWzVWtDZyD4sDgjR4E5DWO7zo4zjIlug/view?usp=sharing&resourcekey=0-9Xg0ydi-qsC8uxZMoPoWQQ',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'On-Device Google AI',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['On-Device Google AI'],
    tags: ['help me read', 'google ai', 'summarize', 'simplify'],
  },
  {
    id: 'off-12',
    title: 'Quick Insert',
    description: 'Demo showing how to use the Quick Insert key for AI-powered productivity.',
    url: 'https://drive.google.com/file/d/1ilxG0_o0Ft_dDSQ5Q9a6zyo9QNzFqtQG/view?usp=drive_link',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'On-Device Google AI',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['On-Device Google AI'],
    tags: ['quick insert', 'google ai', 'key', 'hardware', 'keyboard'],
  },
  {
    id: 'off-13',
    title: 'Live Translate',
    description: 'Demo of real-time Live Translate capabilities on Chromebook.',
    url: 'https://drive.google.com/file/d/1sQj8fw6lttuwIaUqFd0iSSlL0sZunb5r/view?usp=sharing',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'On-Device Google AI',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['On-Device Google AI'],
    tags: ['live translate', 'translation', 'google ai', 'on-screen', 'language'],
  },
  {
    id: 'off-14',
    title: 'Select to Search with Lens',
    description: 'How to use Google Lens on Chromebook to select and search anything on your screen.',
    url: 'https://drive.google.com/file/d/1dxvAGtpvfwzWHilREchrvMF_vn5qP4IP/view?usp=drive_link',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'On-Device Google AI',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['On-Device Google AI'],
    tags: ['google lens', 'search', 'chrome', 'chromeOS', 'results'],
  },
  {
    id: 'off-16',
    title: 'Help Me Write',
    description: 'Demo of the AI-powered Help Me Write feature on Chromebook.',
    url: 'https://drive.google.com/file/d/10S-J8RrlfBT5LOEqXw-kN-JtP9wZAsMO/view?usp=sharing&resourcekey=0-MSbneKA1iAhh57Hcuw-vVg',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'On-Device Google AI',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['On-Device Google AI'],
    tags: ['help me write', 'google ai', 'quick insert', 'prompt', 'draft'],
  },
  {
    id: 'off-15',
    title: 'Google AI Pro Perk (CAD)',
    description: 'Learn about the exclusive perks and offers available to Chromebook users.',
    url: 'https://drive.google.com/file/d/1ZZqW3Gjcj9qZ6LJSd8s7cDd0wt0pjwvU/view?usp=drive_link',
    source: DemoSource.OFFICIAL,
    status: DemoStatus.LIVE,
    useCase: 'Perks',
    profile: 'General',
    type: DemoType.INFOSHEET,
    toolsUsed: ['Perks'],
    tags: ['perks', 'google ai pro', 'canada', 'basics', '5TB', 'value', 'offers', 'extras'],
  }

];

// --- Exported Update Data ---

export const UPDATES_DATA: UpdateItem[] = [];

// --- Exported Tools Data ---

export const AI_TOOLS_DATA: ToolReference[] = [
  {
    id: 'tool-nano',
    name: 'Nano Banana',
    description: 'Major quality updates with the new Nano Banana Pro, utilizing Gemini 3.',
    valueProp: 'Last official update: Nov 20th',
    iconName: 'Zap',
    learnMoreUrl: 'https://blog.google/technology/ai/nano-banana-pro/'
  },
  {
    id: 'tool-aistudio',
    name: 'Google AI Studio',
    description: 'Gemini 3 powers Google AI Studio\'s multi-modal understanding, crowning the #1 spot on WebDev Arena.',
    valueProp: 'Last official update: Nov 18th',
    iconName: 'Code',
    learnMoreUrl: 'https://blog.google/technology/developers/gemini-3-developers/'
  },
  {
    id: 'tool-veo',
    name: 'Veo 3.1',
    description: 'Rolling out Veo 3.1 updates and integrating more advanced capabilities in Flow.',
    valueProp: 'Last official update: Oct 15th',
    iconName: 'Video',
    learnMoreUrl: 'https://blog.google/technology/ai/veo-updates-flow/'
  },
];

// --- Exported Aggregated Data ---

export const DEMO_DATA = [
  ...CHATBOT_DEMOS,
  ...AI_EXPERIENCE_DEMOS,
  ...DYK_SERIES_DEMOS,
  ...EVENT_DEMOS,
  ...MARKETING_DEMOS,
  ...OFFICIAL_SOURCES_DATA
];
