import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function checkLogin() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!);
    return (decoded as { user_id: string }).user_id;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}