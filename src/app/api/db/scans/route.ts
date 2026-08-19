import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  return NextResponse.json(ServerDB.getScans());
}

export async function POST(req: Request) {
  try {
    const scan = await req.json();
    ServerDB.addScan(scan);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { sha256 } = await req.json();
    ServerDB.quarantineFile(sha256);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
