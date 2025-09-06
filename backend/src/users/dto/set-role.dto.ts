import { IsIn } from 'class-validator';
import type { Role } from '../entities/user.entity';

export class SetRoleDto {
    @IsIn(['USER', 'ADMIN'])
    role: Role;
}
