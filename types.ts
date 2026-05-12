
export enum DemoSource {
  CHATBOT_PROJECT = 'Chatbot Project',
  AI_EXPERIENCE = 'AI Experience Program',
  DYK_SERIES = 'Did You Know Series',
  EVENT_DEMOS = 'Event Demos',
  MARKETING = 'Marketing & GTE',
  OFFICIAL = 'Official Gemini Sources',
  TRAINING = 'Partner Training Content',
}

export enum DemoStatus {
  LIVE = 'Live',
  IN_PRODUCTION = 'In Production',
}

export enum DemoCategory {
  PRODUCTIVITY = 'Productivity',
  CREATIVITY = 'Creativity',
  CODING = 'Coding',
  EDUCATION = 'Education',
  GENERAL = 'General',
  GAMING = 'Gaming',
  RESEARCH = 'Research',
}

export enum DemoType {
  VIDEO = 'Video (MP4)',
  INFOSHEET = 'Infosheet (PDF)',
  DECK = 'Slide (PDF)',
  INTERACTIVE = 'eLearning (SCORM)',
  WEBPAGE = 'Web Resource',
  GIF = 'Demo (GIF)',
}

export interface DemoItem {
  id: string;
  title: string;
  description: string;
  url: string; // The link to the demo/deck/video
  thumbnailUrl?: string;
  source: DemoSource;
  status: DemoStatus;
  readyByDate?: string; // ISO date string YYYY-MM-DD
  useCase: string; // Formerly category
  profile: string; // New Profile column (Student, Gamer, etc.)
  type: DemoType;
  toolsUsed: string[]; // e.g., ["Gemini Advanced", "Imagen"]
  tags: string[]; // Searchable tags
  featured?: boolean;
}

export interface UpdateBullet {
  text: string;
  link?: string;
}

export interface UpdateItem {
  id: string;
  date: string;
  tag: string;
  bullets: UpdateBullet[];
}

export interface ToolReference {
  id: string;
  name: string;
  description: string;
  valueProp: string;
  iconName: string; // Mapped to Lucide icons in UI
  learnMoreUrl: string;
}
