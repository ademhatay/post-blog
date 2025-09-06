import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
    private posts: PostEntity[] = [];
    private idSeq = 1;

    constructor(private usersService: UsersService) {
        const user1 = this.usersService.findByEmail('adem@adem.com');
        const user2 = this.usersService.findByEmail('burak@burak.com');
        if (user1) this.posts.push({ id: this.idSeq++, userId: user1.id, title: 'Adem first post', body: 'Hello Adem' });
        if (user2) this.posts.push({ id: this.idSeq++, userId: user2.id, title: 'Burak first post' });
    }

    findAll(userId?: number) {
        let posts = userId ? this.posts.filter(p => p.userId === userId) : [...this.posts];

        return posts.map(post => {
            const user = this.usersService.findOne(post.userId);
            return {
                ...post,
                user: user ? {
                    id: user.id,
                    email: user.email,
                    role: user.role
                } : null
            };
        });
    }

    findOne(id: number) {
        return this.posts.find(p => p.id === id);
    }

    createForUser(userId: number, data: { title: string; body?: string }): PostEntity {
        const user = this.usersService.findOne(userId);
        if (!user) throw new UnprocessableEntityException('Invalid userId');
        const post: PostEntity = { id: this.idSeq++, userId, title: data.title, body: data.body };
        this.posts.push(post);
        return post;
    }

    update(id: number, data: Partial<{ title: string; body?: string }>): PostEntity {
        const post = this.findOne(id);
        if (!post) throw new NotFoundException('Post not found');
        if (data.title !== undefined) post.title = data.title;
        if (data.body !== undefined) post.body = data.body;
        return post;
    }

    remove(id: number) {
        const idx = this.posts.findIndex(p => p.id === id);
        if (idx === -1) throw new NotFoundException('Post not found');
        this.posts.splice(idx, 1);
    }

    removeByUser(userId: number): number {
        const before = this.posts.length;
        this.posts = this.posts.filter(p => p.userId !== userId);
        return before - this.posts.length;
    }
}
