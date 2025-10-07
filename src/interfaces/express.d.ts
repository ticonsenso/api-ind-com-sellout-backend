import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      usuario?: UserConsenso; // O puedes usar tu propio tipo si no es JwtPayload
    }
  }
}
