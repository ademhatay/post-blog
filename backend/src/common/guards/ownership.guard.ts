import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsService } from '../../posts/posts.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(private postsService: PostsService) { }

    canActivate(ctx: ExecutionContext): boolean {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user as { sub: number; role: 'USER' | 'ADMIN' };
        const idParam = req.params?.id;
        const id = Number(idParam);

        const post = this.postsService.findOne(id);
        if (!post) throw new NotFoundException('Post not found');

        if (user.role === 'ADMIN') return true;
        if (post.userId === user.sub) return true;

        throw new ForbiddenException('Not owner of the resource');
    }
}
