import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserEmailGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest<Request>();

		if (!req.user?.email) {
			throw new UnauthorizedException('X-User-Email header is required');
		}

		return true;
	}
}

export function UseUserEmailGuard() {
	return UseGuards(UserEmailGuard);
}
