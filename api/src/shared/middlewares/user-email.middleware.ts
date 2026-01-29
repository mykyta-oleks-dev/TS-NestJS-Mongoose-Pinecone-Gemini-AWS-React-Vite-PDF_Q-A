import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserEmailMiddleware implements NestMiddleware {
	use(req: Request, _res: Response, next: NextFunction) {
		const email = req.header('X-User-Email');

		if (email) {
			req.user = { email };
		}

		next();
	}
}
