import { jwtVerify, SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(SECRET_KEY);
}

export async function checkLogin(): Promise<string | null> {
  const cookieString = document.cookie;
  const cookies = parseCookies(cookieString);
  const token = cookies['token'];

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export function getUserId(): string | null {
  const cookieString = document.cookie;
  const cookies = parseCookies(cookieString);
  const token = cookies['token'];

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.userId;
  } catch (error) {
    return null;
  }
}

// Helper function to parse cookies
function parseCookies(cookieString: string) {
  return cookieString
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });
}
