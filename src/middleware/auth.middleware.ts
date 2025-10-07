import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserConsenso } from '../interfaces/user.consenso';

const KEY_SECRET = process.env.JWT_SECRET ?? 'default_secret';

export const generateToken = (user: UserConsenso): string => {
  try {
    return jwt.sign(user, KEY_SECRET, { expiresIn: '720h' });
  } catch (error) {
    console.error('Error al generar el token:', error);
    throw error;
  }
};

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ mensaje: 'Acceso denegado. Token faltante.' });
    return;
  }
  jwt.verify(token, KEY_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
    if (typeof decoded === 'object' && decoded !== null) {
      (req as any).usuario = {
        email: decoded.email,
        name_id: decoded.name_id,
        session_index: decoded.session_index,
        given_name: decoded.given_name,
        surname: decoded.surname,
        cedula: decoded.cedula,
        estado: decoded.estado,
      } as UserConsenso;
    }
    next();
  });
}

export function decodeToken(token: string): UserConsenso {
  const decoded = jwt.verify(token, KEY_SECRET);
  return decoded as UserConsenso;
}
