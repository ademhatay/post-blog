import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User, Role } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private users: User[] = [];
    private idSeq = 1;

    constructor() {
        this.seed();
    }

    private seed() {
        const adminPass = bcrypt.hashSync('admin123', 10);
        const userPass = bcrypt.hashSync('user123', 10);

        this.users.push(
            { id: this.idSeq++, name: 'Admin', username: 'admin', email: 'admin@admin.com', role: 'ADMIN', passwordHash: adminPass },
            { id: this.idSeq++, name: 'Adem', username: 'adem', email: 'adem@adem.com', role: 'USER', passwordHash: userPass },
            { id: this.idSeq++, name: 'Burak', username: 'burak', email: 'burak@burak.com', role: 'USER', passwordHash: userPass },
        );
    }

    private ensureEmailUnique(email: string, ignoreId?: number) {
        const exists = this.users.find(u => u.email === email && u.id !== ignoreId);
        if (exists) throw new ConflictException('Email already in use');
    }

    findAll(): User[] {
        return [...this.users];
    }

    findOne(id: number): User | undefined {
        return this.users.find(u => u.id === id);
    }

    findByEmail(email: string): User | undefined {
        return this.users.find(u => u.email === email);
    }

    async create(data: { name: string; username: string; email: string; password: string; role?: Role }): Promise<User> {
        this.ensureEmailUnique(data.email);
        const passwordHash = await bcrypt.hash(data.password, 10);
        const user: User = {
            id: this.idSeq++,
            name: data.name,
            username: data.username,
            email: data.email,
            role: data.role ?? 'USER',
            passwordHash,
        };
        this.users.push(user);
        return user;
    }

    async update(id: number, data: Partial<{ name: string; username: string; email: string; password: string }>): Promise<User> {
        const user = this.findOne(id);
        if (!user) throw new NotFoundException('User not found');

        if (data.email && data.email !== user.email) this.ensureEmailUnique(data.email, user.id);

        if (data.name !== undefined) user.name = data.name;
        if (data.username !== undefined) user.username = data.username;
        if (data.email !== undefined) user.email = data.email;
        if (data.password) user.passwordHash = await bcrypt.hash(data.password, 10);

        return user;
    }

    remove(id: number) {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx === -1) throw new NotFoundException('User not found');
        this.users.splice(idx, 1);
    }

    setRole(id: number, role: Role): User {
        const user = this.findOne(id);
        if (!user) throw new NotFoundException('User not found');
        user.role = role;
        return user;
    }
}