export type Role = 'USER' | 'ADMIN';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: Role;
    passwordHash: string;
}
