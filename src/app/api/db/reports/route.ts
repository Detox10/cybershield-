import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  const reports = await ServerDB.getReports();
  return NextResponse.json(reports);
}

export async function POST(req: Request) {
  try {
    const report = await req.json();
    await ServerDB.addReport(report);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
