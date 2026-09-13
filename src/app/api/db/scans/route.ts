import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  const scans = await ServerDB.getScans();
  return NextResponse.json(scans);
}

export async function POST(req: Request) {
  try {
    const scan = await req.json();
    await ServerDB.addScan(scan);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { sha256 } = await req.json();
    await ServerDB.quarantineFile(sha256);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
