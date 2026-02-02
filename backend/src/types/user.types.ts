//this is a user obhect. It is everything in the database
export interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password_hash: string;
    is_verified: boolean;
    verification_token?: string | null;
    reset_token?: string | null;
    reset_token_expires?: Date | null;
    created_at: Date;
    updated_at: Date;
};
 
//this is a register request object. It is only what the user provides
export interface RegisterRequest {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string; //Plain password is not hashed yet
};

//this is object for login response. What we send back(never include password)
export interface LoginResponse {
    user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;    
    is_verified: boolean;
    };
    token: string;
};

export interface LoginRequest {
    email: string;
    password: string;
};
