import create from 'zustand'; import { 
ExtractionMethod, OutputFormat, 
VisualSelection, ScraperConfig } from 
'../types'; interface ScraperState {
  url: string; extractionMethod: 
  ExtractionMethod; cssSelector: string; 
  xpathExpression: string; aiDescription: 
  string; visualSelections: 
  VisualSelection[]; enablePagination: 
  boolean; paginationSelector: string; 
  paginationUrlPattern: string; 
  enableInfiniteScroll: boolean; scrollDelay: 
  number; maxScrollAttempts: number; 
  loginRequired: boolean; username: string; 
  password: string; outputFormat: 
  OutputFormat; outputDestination: string; 
  respectRobotsTxt: boolean; requestDelay: 
  number; userAgent: string; isRunning: 
  boolean; logs: string[]; results: any[];
  
  // Actions
  setUrl: (url: string) => void; 
  setExtractionMethod: (method: 
  ExtractionMethod) => void; setCssSelector: 
  (selector: string) => void; 
  setXpathExpression: (xpath: string) => 
  void; setAiDescription: (description: 
  string) => void; addVisualSelection: 
  (selector: string, label: string) => void; 
  removeVisualSelection: (selector: string) 
  => void; togglePagination: () => void; 
  setPaginationSelector: (selector: string) 
  => void; setPaginationUrlPattern: (pattern: 
  string) => void; toggleInfiniteScroll: () 
  => void; setScrollDelay: (delay: number) => 
  void; setMaxScrollAttempts: (attempts: 
  number) => void; toggleLoginRequired: () => 
  void; setUsername: (username: string) => 
  void; setPassword: (password: string) => 
  void; setOutputFormat: (format: 
  OutputFormat) => void; 
  setOutputDestination: (destination: string) 
  => void; toggleRespectRobotsTxt: () => 
  void; setRequestDelay: (delay: number) => 
  void; setUserAgent: (userAgent: string) => 
  void; setIsRunning: (isRunning: boolean) => 
  void; addLog: (log: string) => void; 
  clearLogs: () => void; setResults: 
  (results: any[]) => void; clearResults: () 
  => void; resetState: () => void; 
  getScraperConfig: () => ScraperConfig; 
  loadScraperConfig: (config: ScraperConfig) 
  => void;
}
const initialState = { url: '', 
  extractionMethod: 'visual' as 
  ExtractionMethod, cssSelector: '', 
  xpathExpression: '', aiDescription: '', 
  visualSelections: [] as VisualSelection[], 
  enablePagination: false, 
  paginationSelector: '', 
  paginationUrlPattern: '', 
  enableInfiniteScroll: false, scrollDelay: 
  1000, maxScrollAttempts: 10, loginRequired: 
  false, username: '', password: '', 
  outputFormat: 'csv' as OutputFormat, 
  outputDestination: '', respectRobotsTxt: 
  true, requestDelay: 1000, userAgent: 
  'Mozilla/5.0 (compatible; WebScraper/1.0)', 
  isRunning: false, logs: [] as string[], 
  results: [] as any[],
};
export const useScraperStore = 
create<ScraperState>((set, get) => ({
  ...initialState,
  
  setUrl: (url) => set({ url }), 
  setExtractionMethod: (extractionMethod) => 
  set({ extractionMethod }), setCssSelector: 
  (cssSelector) => set({ cssSelector }), 
  setXpathExpression: (xpathExpression) => 
  set({ xpathExpression }), setAiDescription: 
  (aiDescription) => set({ aiDescription }),
  
  addVisualSelection: (selector, label) => 
  set((state) => ({
    visualSelections: 
    [...state.visualSelections, { selector, 
    label }]
  })),
  
  removeVisualSelection: (selector) => 
  set((state) => ({
    visualSelections: 
    state.visualSelections.filter(s => 
    s.selector !== selector)
  })),
  
  togglePagination: () => set((state) => ({ 
  enablePagination: !state.enablePagination 
  })),
  setPaginationSelector: (paginationSelector) 
  => set({ paginationSelector }), 
  setPaginationUrlPattern: 
  (paginationUrlPattern) => set({ 
  paginationUrlPattern }),
  
  toggleInfiniteScroll: () => set((state) => 
  ({ enableInfiniteScroll: 
  !state.enableInfiniteScroll })),
  setScrollDelay: (scrollDelay) => set({ 
  scrollDelay }), setMaxScrollAttempts: 
  (maxScrollAttempts) => set({ 
  maxScrollAttempts }),
  
  toggleLoginRequired: () => set((state) => 
  ({ loginRequired: !state.loginRequired })), 
  setUsername: (username) => set({ username 
  }),
  setPassword: (password) => set({ password 
  }),
  
  setOutputFormat: (outputFormat) => set({ 
  outputFormat }), setOutputDestination: 
  (outputDestination) => set({ 
  outputDestination }),
  
  toggleRespectRobotsTxt: () => set((state) 
  => ({ respectRobotsTxt: 
  !state.respectRobotsTxt })),
  setRequestDelay: (requestDelay) => set({ 
  requestDelay }), setUserAgent: (userAgent) 
  => set({ userAgent }),
  
  setIsRunning: (isRunning) => set({ 
  isRunning }),
  
  addLog: (log) => set((state) => ({ logs: 
  [...state.logs, `${new 
  Date().toISOString()}: ${log}`] })), 
  clearLogs: () => set({ logs: [] }),
  
  setResults: (results) => set({ results }), 
  clearResults: () => set({ results: [] }),
  
  resetState: () => set(initialState),
  
  getScraperConfig: () => { const state = 
    get(); return {
      url: state.url, extractionMethod: 
      state.extractionMethod, cssSelector: 
      state.cssSelector, xpathExpression: 
      state.xpathExpression, aiDescription: 
      state.aiDescription, visualSelections: 
      state.visualSelections, 
      enablePagination: 
      state.enablePagination, 
      paginationSelector: 
      state.paginationSelector, 
      paginationUrlPattern: 
      state.paginationUrlPattern, 
      enableInfiniteScroll: 
      state.enableInfiniteScroll, 
      scrollDelay: state.scrollDelay, 
      maxScrollAttempts: 
      state.maxScrollAttempts, loginRequired: 
      state.loginRequired, username: 
      state.username, password: 
      state.password, outputFormat: 
      state.outputFormat, outputDestination: 
      state.outputDestination, 
      respectRobotsTxt: 
      state.respectRobotsTxt, requestDelay: 
      state.requestDelay, userAgent: 
      state.userAgent,
    };
  },
  
  loadScraperConfig: (config) => { set({ url: 
      config.url || '', extractionMethod: 
      config.extractionMethod || 'visual', 
      cssSelector: config.cssSelector || '', 
      xpathExpression: config.xpathExpression 
      || '',
      aiDescription: config.aiDescription || 
      '', visualSelections: 
      config.visualSelections || [], 
      enablePagination: 
      config.enablePagination || false, 
      paginationSelector: 
      config.paginationSelector || '', 
      paginationUrlPattern: 
      config.paginationUrlPattern || '', 
      enableInfiniteScroll: 
      config.enableInfiniteScroll || false, 
      scrollDelay: config.scrollDelay || 
      1000, maxScrollAttempts: 
      config.maxScrollAttempts || 10, 
      loginRequired: config.loginRequired || 
      false, username: config.username || '', 
      password: config.password || '', 
      outputFormat: config.outputFormat || 
      'csv', outputDestination: 
      config.outputDestination || '', 
      respectRobotsTxt: 
      config.respectRobotsTxt !== false, // 
      Default to true requestDelay: 
      config.requestDelay || 1000, userAgent: 
      config.userAgent || 'Mozilla/5.0 
      (compatible; WebScraper/1.0)',
    });
  },
}));
