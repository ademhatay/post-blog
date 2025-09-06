import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { OwnershipGuard } from '../common/guards/ownership.guard';

@Module({
    imports: [forwardRef(() => UsersModule)],
    providers: [PostsService, OwnershipGuard],
    controllers: [PostsController],
    exports: [PostsService],
})
export class PostsModule { }
