import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { hostname, osBuild, setupToken } = data;

    // Hardcoded setup token for hackathon to prevent rogue enrollment
    if (setupToken !== "CYBERSHIELD_SETUP_2026") {
      return NextResponse.json({ error: "Invalid setup token" }, { status: 401 });
    }

    const finalHostname = hostname || `Unknown-${crypto.randomUUID().split('-')[0]}`;
    const finalOsBuild = osBuild || 'Unknown Build';
    const adminCap = data.hasAdminPrivileges === true;

    // Generate a unique device secret
    const deviceSecret = crypto.randomBytes(32).toString('hex');

    const agent = await prisma.agent.create({
      data: {
        hostname: finalHostname,
        osBuild: finalOsBuild,
        credentialSecret: deviceSecret,
        hasAdminPrivileges: adminCap,
      },
    });

    return NextResponse.json({
      success: true,
      deviceId: agent.id,
      deviceSecret: deviceSecret,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}
