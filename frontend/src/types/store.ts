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


export type KioskView = "HOME" | "CHECK_IN" | 
  "REGISTER" | "REGISTER_WALK_IN" | "REGISTER_MEMBER" | "REGISTER_MEMBER_2";


export interface KioskState {
  currentView: KioskView,
  // inputText: string,
  // count: number,
  memberFormData: {
    name: string,
    phone?: string,
  },
}