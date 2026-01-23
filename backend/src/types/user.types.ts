//this is a user obhect
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
 

//this is a register request object
export interface RegisterRequest {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string; //Plain password is not hashed yet
};




