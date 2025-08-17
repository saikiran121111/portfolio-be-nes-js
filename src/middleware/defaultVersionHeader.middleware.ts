import { HEADER_VERSION } from '../constants/headerVersion';
import { Request, Response, NextFunction } from 'express';

export function defaultVersionHeaderMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.headers['version']) {
    req.headers['version'] = HEADER_VERSION;
  }
  next();
}
