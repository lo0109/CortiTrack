export interface User {
  id: string;
  name: string;
  picture?: string;
  dob: string;
  sex: 'male' | 'female';
  team: string;
  email: string;
  password: string;
  role: 'athlete' | 'coach' | 'admin' | 'healthcare_provider';
}

export interface Report {
  id: string;
  user_id: string;
  stress_level: number;
  heart_rate: number;
  blood_oxygen_lv: number;
  sleep_quality: number;
  medical_context?: string;
  timestamp: string;
  date: string; // YYYY-MM-DD format for easier querying
}

export interface MedicalHistory {
  id: string;
  user_id: string;
  condition: string;
  diagnosis_date: string;
  notes: string;
  created_at: string;
}

export interface Setting {
  user_id: string;
  notification: boolean;
  sound: boolean;
}

export interface GaugeColorSettings {
  low: string;    // 0-33%
  medium: string; // 34-66%
  high: string;   // 67-100%
}

export interface GaugeSettings {
  stress_level: { 
    min: number; 
    max: number;
    colors: GaugeColorSettings;
  };
  heart_rate: { 
    min: number; 
    max: number;
    colors: GaugeColorSettings;
  };
  blood_oxygen_lv: { 
    min: number; 
    max: number;
    colors: GaugeColorSettings;
  };
  sleep_quality: { 
    min: number; 
    max: number;
    colors: GaugeColorSettings;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}