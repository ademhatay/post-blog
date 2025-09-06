import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, AppConfigService } from './config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
  controllers: [AppController],
})
export class AppModule {}
