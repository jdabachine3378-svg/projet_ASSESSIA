const STORAGE_KEYS = {
  AUTH: 'assessai_auth',
  REFERENCE: 'assessai_reference',
  REPORT: 'assessai_report'
};

export const storage = {
  getAuth: () => {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  
  setAuth: (auth) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
  },
  
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },
  
  getReference: () => {
    return localStorage.getItem(STORAGE_KEYS.REFERENCE) || '';
  },
  
  setReference: (text) => {
    localStorage.setItem(STORAGE_KEYS.REFERENCE, text);
  },
  
  getReport: () => {
    const data = localStorage.getItem(STORAGE_KEYS.REPORT);
    return data ? JSON.parse(data) : [];
  },
  
  addToReport: (entry) => {
    const report = storage.getReport();
    report.push({
      ...entry,
      date: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.REPORT, JSON.stringify(report));
    return report;
  },
  
  clearReport: () => {
    localStorage.removeItem(STORAGE_KEYS.REPORT);
  }
};
