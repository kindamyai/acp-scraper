export type ExtractionMethod = 'visual' | 
'css' | 'xpath' | 'ai'; export type 
OutputFormat = 'csv' | 'json' | 
'google_sheets'; export interface 
VisualSelection {
  selector: string; label: string;
}
export interface User { id: string; username: 
  string; email: string;
}
export interface ScraperConfig { id?: string; 
  name?: string; url: string; 
  extractionMethod: ExtractionMethod; 
  cssSelector?: string; xpathExpression?: 
  string; aiDescription?: string; 
  visualSelections?: VisualSelection[]; 
  enablePagination: boolean; 
  paginationSelector?: string; 
  paginationUrlPattern?: string; 
  enableInfiniteScroll: boolean; scrollDelay: 
  number; maxScrollAttempts: number; 
  loginRequired: boolean; username?: string; 
  password?: string; outputFormat: 
  OutputFormat; outputDestination?: string; 
  respectRobotsTxt: boolean; requestDelay: 
  number; userAgent: string; isPublic?: 
  boolean; createdAt?: string; updatedAt?: 
  string;
}
export interface ScraperJob { jobId: string; 
  status: 'queued' | 'running' | 'completed' 
  | 'failed' | 'cancelled';
  logs: string[]; results?: any[]; error?: 
  string; createdAt: string; completedAt?: 
  string;
}
