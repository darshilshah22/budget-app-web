import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = (process.env.JWT_SECRET || 'your_jwt_secret_key') as Secret;
  const options: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
  };
  return jwt.sign({ userId }, secret, options);
}; 