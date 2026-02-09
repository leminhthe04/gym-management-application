export interface Admin {
  id: string;        
  username: string;
  createdAt?: string;
}

export interface AuthState {
  admin: Admin | null;          
  accessToken: string | null; 
  loading: boolean;           
  error?: string | null;      
}

export interface KioskState {
  inputText: string,
  count: number,
}