import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  return NextResponse.json(ServerDB.getUsers());
}

export async function POST(req: Request) {
  try {
    const user = await req.json();
    ServerDB.addUser(user);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
