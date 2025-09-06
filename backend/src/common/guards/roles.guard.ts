import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const req = ctx.switchToHttp().getRequest();
        const user = req.user as { role?: Role };

        if (!user?.role) throw new ForbiddenException('Role required');
        const ok = requiredRoles.includes(user.role);
        if (!ok) throw new ForbiddenException('Insufficient role');
        return ok;
    }
}
