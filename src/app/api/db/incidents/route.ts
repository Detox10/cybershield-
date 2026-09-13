import { NextResponse } from 'next/server';
import { ServerDB } from '@/lib/serverDb';

export async function GET() {
  const incidents = await ServerDB.getIncidents();
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  try {
    const incident = await req.json();
    await ServerDB.addIncident(incident);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
