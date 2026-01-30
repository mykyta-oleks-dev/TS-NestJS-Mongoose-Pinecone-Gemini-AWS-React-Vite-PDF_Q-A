import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UseGuards,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { InfraConfig, TypedConfigService } from '../types/config-service.types';
import { Request } from 'express';

@Injectable()
export class InternalHmacGuard implements CanActivate {
	constructor(private readonly config: TypedConfigService) {}

	canActivate(ctx: ExecutionContext): boolean {
		const req = ctx.switchToHttp().getRequest<Request>();

		const signature = req.headers['x-signature'];
		const timestamp = req.headers['x-timestamp'];

		if (typeof signature !== 'string' || typeof timestamp !== 'string') {
			return false;
		}

		// Prevent replay attacks (5 min window)
		if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60_000) {
			return false;
		}

		const secret = this.config.get<InfraConfig>('infra')?.hmacSecret;

		if (!secret) {
			return false;
		}

		const payload = `${timestamp}.${JSON.stringify(req.body)}`;

		const expected = crypto
			.createHmac('sha256', secret)
			.update(payload)
			.digest('hex');

		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expected),
		);
	}
}

export function UseInternalHmacGuard() {
	return UseGuards(InternalHmacGuard);
}
