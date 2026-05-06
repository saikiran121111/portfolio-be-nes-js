import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

function getAdminApiSecret(): string {
  const configured = process.env.ADMIN_API_SECRET;
  if (configured) return configured;

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-admin-api-secret-change-me';
  }

  throw new UnauthorizedException('ADMIN_API_SECRET is not configured');
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const apiKeyHeader = request.headers['x-admin-api-key'];
    const providedKey = Array.isArray(apiKeyHeader)
      ? apiKeyHeader[0]
      : apiKeyHeader;

    if (typeof providedKey !== 'string' || !providedKey) {
      throw new UnauthorizedException('Missing admin API key');
    }

    const configuredKey = getAdminApiSecret();
    if (!safeCompare(providedKey, configuredKey)) {
      throw new UnauthorizedException('Invalid admin API key');
    }

    return true;
  }
}
