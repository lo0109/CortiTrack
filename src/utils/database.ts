import { User, Report, Setting, GaugeSettings, MedicalHistory, GaugeColorSettings } from '../types';

const STORAGE_KEYS = {
  USERS: 'corti_track_users',
  REPORTS: 'corti_track_reports',
  SETTINGS: 'corti_track_settings',
  GAUGE_SETTINGS: 'corti_track_gauge_settings',
  MEDICAL_HISTORY: 'corti_track_medical_history',
};

// Helper function to generate historical data
const generateHistoricalData = (userId: string, todayStress: number): Report[] => {
  const reports: Report[] = [];
  const today = new Date();
  
  // Generate data for the past 6 days plus today (7 days total)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let stress: number;
    
    if (i === 0) {
      // Today - use the provided stress level
      stress = todayStress;
    } else {
      // Past days - generate realistic variations around the today's value
      const baseVariation = (Math.random() - 0.5) * 40; // ±20 points variation
      const trendFactor = i * 2; // Slight trend towards today's value
      stress = Math.max(0, Math.min(100, todayStress + baseVariation - trendFactor));
    }
    
    // Generate correlated health metrics
    const heartRateBase = stress > 70 ? 85 : stress > 50 ? 75 : 68;
    const heartRateVariation = (Math.random() - 0.5) * 20;
    const heartRate = Math.max(50, Math.min(120, heartRateBase + heartRateVariation));
    
    const oxygenBase = stress > 80 ? 94 : 97;
    const oxygenVariation = (Math.random() - 0.5) * 4;
    const oxygen = Math.max(90, Math.min(100, oxygenBase + oxygenVariation));
    
    const sleepBase = stress > 70 ? 60 : stress > 50 ? 75 : 85;
    const sleepVariation = (Math.random() - 0.5) * 20;
    const sleep = Math.max(30, Math.min(100, sleepBase + sleepVariation));
    
    reports.push({
      id: `${userId}_${date.getTime()}`,
      user_id: userId,
      stress_level: Math.round(stress),
      heart_rate: Math.round(heartRate),
      blood_oxygen_lv: Math.round(oxygen),
      sleep_quality: Math.round(sleep),
      medical_context: stress > 80 ? 'Elevated stress levels noted. Monitor closely.' : undefined,
      timestamp: date.toISOString(),
      date: date.toISOString().split('T')[0]
    });
  }
  
  return reports;
};

// Default gauge settings - used as fallback and for initialization
const getDefaultGaugeSettings = (): GaugeSettings => ({
  stress_level: { 
    min: 0, 
    max: 100,
    colors: {
      low: '#10b981',    // green-500
      medium: '#f59e0b', // orange-500
      high: '#ef4444'    // red-500
    }
  },
  heart_rate: { 
    min: 40, 
    max: 180,
    colors: {
      low: '#10b981',    // green-500
      medium: '#f59e0b', // orange-500
      high: '#ef4444'    // red-500
    }
  },
  blood_oxygen_lv: { 
    min: 90, 
    max: 100,
    colors: {
      low: '#10b981',    // green-500
      medium: '#f59e0b', // orange-500
      high: '#ef4444'    // red-500
    }
  },
  sleep_quality: { 
    min: 0, 
    max: 100,
    colors: {
      low: '#10b981',    // green-500
      medium: '#f59e0b', // orange-500
      high: '#ef4444'    // red-500
    }
  }
});

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Admin',
        email: 'admin@mail.com',
        password: '12345678',
        role: 'admin',
        dob: '1990-01-01',
        sex: 'male',
        team: 'admin',
        picture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@mail.com',
        password: '12345678',
        role: 'coach',
        dob: '1985-05-15',
        sex: 'female',
        team: 'Team Alpha',
        picture: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@mail.com',
        password: '12345678',
        role: 'athlete',
        dob: '1995-08-22',
        sex: 'male',
        team: 'Team Alpha',
        picture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '4',
        name: 'Emma Wilson',
        email: 'emma@mail.com',
        password: '12345678',
        role: 'athlete',
        dob: '1997-03-10',
        sex: 'female',
        team: 'Team Alpha',
        picture: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      {
        id: '5',
        name: 'Dr. Sam Patel',
        email: 'provider1@mail.com',
        password: 'Abc12345678',
        role: 'healthcare_provider',
        dob: '1985-07-22',
        sex: 'male',
        team: 'Team Alpha',
        picture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Only generate reports if they don't exist
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    const mikeReports = generateHistoricalData('3', 45); // Mike - current stress: 45%
    const emmaReports = generateHistoricalData('4', 82); // Emma - current stress: 82%
    
    const defaultReports: Report[] = [...mikeReports, ...emmaReports];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(defaultReports));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_HISTORY)) {
    const defaultMedicalHistory: MedicalHistory[] = [
      {
        id: '1',
        user_id: '3',
        condition: 'Previous Concussion',
        diagnosis_date: '2023-03-15',
        notes: 'Mild concussion from training incident. Fully recovered. Monitor for stress-related symptoms.',
        created_at: new Date('2023-03-15').toISOString()
      },
      {
        id: '2',
        user_id: '3',
        condition: 'Seasonal Allergies',
        diagnosis_date: '2022-04-10',
        notes: 'Mild seasonal allergies affecting spring training. Managed with antihistamines.',
        created_at: new Date('2022-04-10').toISOString()
      },
      {
        id: '3',
        user_id: '4',
        condition: 'Asthma',
        diagnosis_date: '2020-01-20',
        notes: 'Exercise-induced asthma. Uses rescue inhaler as needed. Monitor stress levels as trigger.',
        created_at: new Date('2020-01-20').toISOString()
      },
      {
        id: '4',
        user_id: '4',
        condition: 'Ankle Sprain',
        diagnosis_date: '2024-01-05',
        notes: 'Grade 2 ankle sprain. Completed physical therapy. Cleared for full activity.',
        created_at: new Date('2024-01-05').toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MEDICAL_HISTORY, JSON.stringify(defaultMedicalHistory));
  }

  if (!localStorage.getItem(STORAGE_KEYS.GAUGE_SETTINGS)) {
    const defaultGaugeSettings = getDefaultGaugeSettings();
    localStorage.setItem(STORAGE_KEYS.GAUGE_SETTINGS, JSON.stringify(defaultGaugeSettings));
  }
};

export const getUsers = (): User[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const getUser = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const createUser = (userData: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString()
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Generate initial historical data for new athletes
  if (newUser.role === 'athlete') {
    const reports = getReports();
    const newReports = generateHistoricalData(newUser.id, 50); // Default moderate stress
    reports.push(...newReports);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }
  
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...userData };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[userIndex];
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
  
  // Also delete user's reports
  const reports = getReports();
  const filteredReports = reports.filter(report => report.user_id !== id);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filteredReports));
  
  return true;
};

export const getReports = (): Report[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
};

export const getReportsByUser = (userId: string): Report[] => {
  const reports = getReports();
  return reports.filter(report => report.user_id === userId).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

export const getReportsByUserAndDateRange = (userId: string, startDate: string, endDate: string): Report[] => {
  const reports = getReportsByUser(userId);
  return reports.filter(report => 
    report.date >= startDate && report.date <= endDate
  );
};

export const getLatestReport = (userId: string): Report | null => {
  const reports = getReportsByUser(userId);
  return reports.length > 0 ? reports[reports.length - 1] : null;
};

export const getTodaysReport = (userId: string): Report | null => {
  const today = new Date().toISOString().split('T')[0];
  const reports = getReportsByUser(userId);
  return reports.find(report => report.date === today) || null;
};

// New function to save/update today's readings
export const saveTodaysReadings = (userId: string, readingData: {
  stress_level: number;
  heart_rate: number;
  blood_oxygen_lv: number;
  sleep_quality: number;
  medical_context?: string;
}): Report => {
  const reports = getReports();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  
  // Validate data ranges
  const validatedData = {
    stress_level: Math.max(0, Math.min(100, readingData.stress_level)),
    heart_rate: Math.max(30, Math.min(220, readingData.heart_rate)),
    blood_oxygen_lv: Math.max(70, Math.min(100, readingData.blood_oxygen_lv)),
    sleep_quality: Math.max(0, Math.min(100, readingData.sleep_quality)),
    medical_context: readingData.medical_context
  };
  
  // Check if there's already a report for today
  const existingTodayReportIndex = reports.findIndex(
    report => report.user_id === userId && report.date === today
  );
  
  if (existingTodayReportIndex !== -1) {
    // Update existing today's report
    const existingReport = reports[existingTodayReportIndex];
    const updatedReport: Report = {
      ...existingReport,
      ...validatedData,
      timestamp: now.toISOString(), // Update timestamp to current time
    };
    
    reports[existingTodayReportIndex] = updatedReport;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    
    console.log('Updated today\'s report:', updatedReport);
    return updatedReport;
  } else {
    // Create new report for today
    const newReport: Report = {
      id: `${userId}_${now.getTime()}`,
      user_id: userId,
      ...validatedData,
      timestamp: now.toISOString(),
      date: today
    };
    
    reports.push(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    
    console.log('Created new report for today:', newReport);
    return newReport;
  }
};

export const updateReport = (reportId: string, reportData: Partial<Report>, requestingUserId: string): Report | null => {
  // Use the new saveTodaysReadings function instead
  if (reportData.stress_level !== undefined || 
      reportData.heart_rate !== undefined || 
      reportData.blood_oxygen_lv !== undefined || 
      reportData.sleep_quality !== undefined) {
    
    // Get current values from today's report or use defaults
    const currentReport = getTodaysReport(requestingUserId);
    
    const readingData = {
      stress_level: reportData.stress_level ?? currentReport?.stress_level ?? 0,
      heart_rate: reportData.heart_rate ?? currentReport?.heart_rate ?? 70,
      blood_oxygen_lv: reportData.blood_oxygen_lv ?? currentReport?.blood_oxygen_lv ?? 98,
      sleep_quality: reportData.sleep_quality ?? currentReport?.sleep_quality ?? 80,
      medical_context: reportData.medical_context ?? currentReport?.medical_context
    };
    
    return saveTodaysReadings(requestingUserId, readingData);
  }
  
  return null;
};

export const createReport = (reportData: Omit<Report, 'id' | 'timestamp' | 'date'>): Report => {
  const reports = getReports();
  const now = new Date();
  const newReport: Report = {
    ...reportData,
    id: `${reportData.user_id}_${now.getTime()}`,
    timestamp: now.toISOString(),
    date: now.toISOString().split('T')[0]
  };
  
  reports.push(newReport);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  return newReport;
};

export const getMedicalHistory = (): MedicalHistory[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDICAL_HISTORY) || '[]');
};

export const getMedicalHistoryByUser = (userId: string, requestingUserId: string): MedicalHistory[] => {
  const requestingUser = getUser(requestingUserId);
  
  // Row-level security: only admins and healthcare providers can access medical history
  if (!requestingUser || (requestingUser.role !== 'admin' && requestingUser.role !== 'healthcare_provider')) {
    return [];
  }
  
  // Healthcare providers can only see medical history for athletes in their team
  if (requestingUser.role === 'healthcare_provider') {
    const targetUser = getUser(userId);
    if (!targetUser || targetUser.team !== requestingUser.team) {
      return [];
    }
  }
  
  const medicalHistory = getMedicalHistory();
  return medicalHistory.filter(record => record.user_id === userId);
};

export const createMedicalRecord = (recordData: Omit<MedicalHistory, 'id' | 'created_at'>): MedicalHistory => {
  const medicalHistory = getMedicalHistory();
  const newRecord: MedicalHistory = {
    ...recordData,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  medicalHistory.push(newRecord);
  localStorage.setItem(STORAGE_KEYS.MEDICAL_HISTORY, JSON.stringify(medicalHistory));
  return newRecord;
};

export const getGaugeSettings = (): GaugeSettings => {
  initializeData();
  
  const defaultSettings = getDefaultGaugeSettings();
  
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.GAUGE_SETTINGS);
    if (!storedSettings) {
      return defaultSettings;
    }
    
    const parsedSettings = JSON.parse(storedSettings);
    
    // Deep merge stored settings with defaults to ensure all properties exist
    const mergedSettings: GaugeSettings = {};
    
    // Merge each metric type
    Object.keys(defaultSettings).forEach(metricKey => {
      const metric = metricKey as keyof GaugeSettings;
      mergedSettings[metric] = {
        min: parsedSettings[metric]?.min ?? defaultSettings[metric].min,
        max: parsedSettings[metric]?.max ?? defaultSettings[metric].max,
        colors: {
          low: parsedSettings[metric]?.colors?.low ?? defaultSettings[metric].colors.low,
          medium: parsedSettings[metric]?.colors?.medium ?? defaultSettings[metric].colors.medium,
          high: parsedSettings[metric]?.colors?.high ?? defaultSettings[metric].colors.high,
        }
      };
    });
    
    return mergedSettings;
  } catch (error) {
    console.error('Error parsing gauge settings from localStorage:', error);
    // If there's any error parsing, return default settings and reset localStorage
    localStorage.setItem(STORAGE_KEYS.GAUGE_SETTINGS, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
};

export const updateGaugeSettings = (settings: GaugeSettings): void => {
  localStorage.setItem(STORAGE_KEYS.GAUGE_SETTINGS, JSON.stringify(settings));
};

export const getUserSettings = (userId: string): Setting | null => {
  const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '[]');
  return settings.find((s: Setting) => s.user_id === userId) || null;
};

export const updateUserSettings = (userId: string, settings: Omit<Setting, 'user_id'>): void => {
  const allSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '[]');
  const existingIndex = allSettings.findIndex((s: Setting) => s.user_id === userId);
  
  const newSetting: Setting = { user_id: userId, ...settings };
  
  if (existingIndex >= 0) {
    allSettings[existingIndex] = newSetting;
  } else {
    allSettings.push(newSetting);
  }
  
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(allSettings));
};

// Helper function to get last 7 days of data for charts
export const getLast7DaysData = (userId: string): { date: string; stress: number; dayLabel: string }[] => {
  const today = new Date();
  const result = [];
  
  // Get all reports for this user
  const userReports = getReportsByUser(userId);
  
  // Create array for last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Find report for this date
    const dayReport = userReports.find(r => r.date === dateStr);
    
    // Format day label
    const dayLabel = i === 0 ? 'Today' : 
                    i === 1 ? 'Yesterday' : 
                    date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    
    result.push({
      date: dateStr,
      stress: dayReport ? dayReport.stress_level : 0,
      dayLabel
    });
  }
  
  return result;
};

// Helper function to regenerate historical data when needed
export const regenerateHistoricalData = (userId: string, currentStress: number): void => {
  const reports = getReports();
  
  // Remove existing reports for this user
  const filteredReports = reports.filter(report => report.user_id !== userId);
  
  // Generate new historical data
  const newReports = generateHistoricalData(userId, currentStress);
  
  // Save updated reports
  const updatedReports = [...filteredReports, ...newReports];
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updatedReports));
};

// Force regenerate data to fix any existing issues
export const forceDataRefresh = (): void => {
  // Clear existing reports
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
  
  // Reinitialize with fresh data
  initializeData();
};

// Force regenerate data with specific stress levels for current users
export const forceRegenerateWithCurrentStress = (): void => {
  // Clear existing reports
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
  
  // Generate fresh data with specific stress levels
  const mikeReports = generateHistoricalData('3', 45); // Mike - 45% stress
  const emmaReports = generateHistoricalData('4', 82); // Emma - 82% stress
  
  const allReports: Report[] = [...mikeReports, ...emmaReports];
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(allReports));
};