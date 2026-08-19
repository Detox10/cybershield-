import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  return NextResponse.json(ServerDB.getReports());
}

export async function POST(req: Request) {
  try {
    const report = await req.json();
    ServerDB.addReport(report);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
