import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query("SELECT value FROM settings WHERE key = 'important_note'");
    return NextResponse.json({ note: result.rows.length ? result.rows[0].value : '' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    await query("INSERT INTO settings (key, value) VALUES ('important_note', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [content]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
