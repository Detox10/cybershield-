import { NextRequest, NextResponse } from 'next/server';
import { simpleParser, ParsedMail } from 'mailparser';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { EmailRulesEngine } from '@/lib/emailRulesEngine';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    let emlContent = formData.get('content') as string | null;

    if (file) {
      emlContent = await file.text();
    }

    if (!emlContent) {
      return NextResponse.json({ error: 'No .eml file or content provided' }, { status: 400 });
    }

    const parsed: ParsedMail = await simpleParser(emlContent);

    // 1. Extract Headers
    const headersList: { key: string; value: string }[] = [];
    parsed.headers.forEach((value, key) => {
      headersList.push({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      });
    });

    // Extract authentication headers
    const authResults = parsed.headers.get('authentication-results');
    let observedSpf = 'Unknown';
    let observedDkim = 'Unknown';
    let observedDmarc = 'Unknown';

    if (authResults && typeof authResults === 'string') {
      const lowerAuth = authResults.toLowerCase();
      if (lowerAuth.includes('spf=pass')) observedSpf = 'PASS';
      else if (lowerAuth.includes('spf=')) observedSpf = 'FAIL';

      if (lowerAuth.includes('dkim=pass')) observedDkim = 'PASS';
      else if (lowerAuth.includes('dkim=')) observedDkim = 'FAIL';

      if (lowerAuth.includes('dmarc=pass')) observedDmarc = 'PASS';
      else if (lowerAuth.includes('dmarc=')) observedDmarc = 'FAIL';
    }

    // 2. Extract URLs (Regex from text/html)
    const urlRegex = /(https?:\/\/[^\s"'<>]+)/g;
    const bodyContent = parsed.text || parsed.html || '';
    const extractedUrls = Array.from(new Set(bodyContent.match(urlRegex) || []));

    const urls = extractedUrls.map(u => {
      let domain = '';
      try { domain = new URL(u).hostname; } catch(e) {}
      return {
        url: u,
        domain,
        riskLevel: 'UNKNOWN', // Will be enriched later
      };
    });

    // 3. Extract Attachments and query VirusTotal
    const attachments = await Promise.all(parsed.attachments.map(async (att) => {
      let sha256 = 'unknown';
      if (att.content) {
        const hash = crypto.createHash('sha256');
        hash.update(att.content);
        sha256 = hash.digest('hex');
      }

      let riskLevel = 'UNKNOWN';
      let vtMalicious = 0;
      
      const vtKey = process.env.VIRUSTOTAL_API_KEY;
      if (vtKey && vtKey.length > 20 && sha256 !== 'unknown') {
        try {
          const vtRes = await fetch(`https://www.virustotal.com/api/v3/files/${sha256}`, {
            headers: { 'x-apikey': vtKey }
          });
          if (vtRes.ok) {
            const vtData = await vtRes.json();
            const stats = vtData.data?.attributes?.last_analysis_stats || {};
            vtMalicious = stats.malicious || 0;
            if (vtMalicious > 0) riskLevel = 'HIGH';
            else if (stats.harmless > 0 || stats.undetected > 0) riskLevel = 'LOW';
          }
        } catch (e) {
          console.error("VT Error:", e);
        }
      }

      return {
        filename: att.filename || 'unknown_file',
        mimeType: att.contentType,
        sha256,
        riskLevel
      };
    }));

    // 4. Calculate Risk Score (basic MVP heuristic + VT intel)
    const hasMaliciousAttachment = attachments.some(a => a.riskLevel === 'HIGH');
    
    const evaluation = EmailRulesEngine.evaluate({
      observedSpf,
      observedDkim,
      observedDmarc,
      attachmentCount: attachments.length,
      urlCount: urls.length,
      hasMaliciousAttachment
    });
    
    const riskScore = evaluation.riskScore;
    const riskLevel = evaluation.riskLevel;

    // 5. Create Incident and Email Analysis in DB
    const newIncident = await prisma.incident.create({
      data: {
        title: `Email Security Event: ${parsed.subject || 'No Subject'}`,
        severity: riskLevel,
        status: 'INVESTIGATING',
        emailAnalysis: {
          create: {
            subject: parsed.subject,
            sender: parsed.from?.value[0]?.address,
            recipient: parsed.to ? (Array.isArray(parsed.to) ? parsed.to[0]?.value[0]?.address : parsed.to.value[0]?.address) : undefined,
            date: parsed.date,
            observedSpf,
            observedDkim,
            observedDmarc,
            riskScore,
            riskLevel,
            headers: {
              create: headersList.slice(0, 50) // Store top 50 headers to avoid bloat
            },
            urls: {
              create: urls.slice(0, 50)
            },
            attachments: {
              create: attachments
            }
          }
        }
      },
      include: {
        emailAnalysis: {
          include: {
            headers: true,
            urls: true,
            attachments: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      incidentId: newIncident.id,
      analysis: newIncident.emailAnalysis
    });

  } catch (error) {
    console.error('Email Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze email.' }, { status: 500 });
  }
}
