import { NextRequest, NextResponse } from 'next/server';
import sequelize from '../../../lib/db';

export async function POST(req: NextRequest) {
  const { userId, friendId } = await req.json();

  if (!userId || !friendId) {
    return NextResponse.json({ message: 'Thiếu thông tin userId hoặc friendId' }, { status: 400 });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại trong bảng bạn bè chưa
    const [result, metadata] = await sequelize.query(
      `SELECT * FROM friends WHERE user_id = :userId AND friend_id = :friendId`,
      {
        replacements: { userId, friendId },
      }
    );

    if (result.length > 0) {
      return NextResponse.json({ message: 'Đã là bạn bè' }, { status: 400 });
    }

    // Thêm quan hệ bạn bè
    await sequelize.query(
      `INSERT INTO friends (user_id, friend_id) VALUES (:userId, :friendId)`,
      {
        replacements: { userId, friendId },
      }
    );

    return NextResponse.json({ message: 'Thêm bạn bè thành công' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}
