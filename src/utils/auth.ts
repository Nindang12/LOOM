// Instead of using jsonwebtoken directly, we'll use a simpler approach for client-side
function base64encode(str: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return btoa(str);
}

export function generateToken(userId: string) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  };

  const base64Header = base64encode(JSON.stringify(header));
  const base64Payload = base64encode(JSON.stringify(payload));
  
  // In a real application, you should use a proper signing mechanism
  // This is a simplified version for demonstration
  const signature = base64encode(base64Header + '.' + base64Payload);
  
  return `${base64Header}.${base64Payload}.${signature}`;
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
    
    // Check if token is expired
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decodedPayload.userId;
  } catch (error) {
    return null;
  }
}

function parseCookies(cookieString: string) {
  return cookieString
    .split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });
}

export const checkLogin = () => {
  const userId = getUserId();
  return userId !== null;
};

export const logout = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  localStorage.removeItem('lastLoginTime');
};