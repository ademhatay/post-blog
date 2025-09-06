import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { OwnershipGuard } from '../common/guards/ownership.guard';

@Controller()
export class PostsController {
    constructor(private postsService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('posts/me')
    listMyPosts(@GetUser() me: { sub: number }) {
        return this.postsService.findAll(me.sub);
    }

    @Get('posts')
    list(@Query('userId') userId?: string) {
        return this.postsService.findAll(userId ? Number(userId) : undefined);
    }

    @Get('posts/:id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id) ?? null;
    }

    @UseGuards(JwtAuthGuard)
    @Post('posts')
    createForMe(@Body() dto: CreatePostDto, @GetUser() me: { sub: number }) {
        return this.postsService.createForUser(me.sub, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('users/:id/posts')
    createForUser(@Param('id', ParseIntPipe) userId: number, @Body() dto: CreatePostDto) {
        return this.postsService.createForUser(userId, dto);
    }

    @UseGuards(JwtAuthGuard, OwnershipGuard)
    @Patch('posts/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
        return this.postsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, OwnershipGuard)
    @Delete('posts/:id')
    remove(@Param('id', ParseIntPipe) id: number) {
        this.postsService.remove(id);
        return { ok: true };
    }
}