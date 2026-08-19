import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  return NextResponse.json(ServerDB.getTimeline());
}

export async function POST(req: Request) {
  try {
    const evt = await req.json();
    ServerDB.addTimelineEvent(evt);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
