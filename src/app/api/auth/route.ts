import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || '';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    const token = jwt.sign(
      { userId },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
} 