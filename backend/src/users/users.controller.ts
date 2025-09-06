import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetRoleDto } from './dto/set-role.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() me: { sub: number; role: 'USER' | 'ADMIN' }) {
    const u = this.usersService.findOne(me.sub);
    if (!u) return null;
    const { passwordHash, ...safe } = u;
    return safe;
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const u = await this.usersService.create(dto);
    const { passwordHash, ...safe } = u;
    return safe;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll().map(({ passwordHash, ...u }) => u);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() me: { sub: number; role: 'USER' | 'ADMIN' },
  ) {
    if (me.role !== 'ADMIN' && me.sub !== id) throw new ForbiddenException();
    const u = this.usersService.findOne(id);
    if (!u) return null;
    const { passwordHash, ...safe } = u;
    return safe;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @GetUser() me: { sub: number; role: 'USER' | 'ADMIN' },
  ) {
    if (me.role !== 'ADMIN' && me.sub !== id) throw new ForbiddenException();
    const u = await this.usersService.update(id, dto);
    const { passwordHash, ...safe } = u;
    return safe;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/role')
  setRole(@Param('id', ParseIntPipe) id: number, @Body() dto: SetRoleDto) {
    const u = this.usersService.setRole(id, dto.role);
    const { passwordHash, ...safe } = u;
    return safe;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.usersService.remove(id);
    return { ok: true };
  }
}