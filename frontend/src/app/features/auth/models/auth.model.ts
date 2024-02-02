export interface RegisterData {
    name:     string;
    surname:  string;
    email:    string;
    password: string; 
}

export interface LoginData {
    email: string;
    password: string;
}