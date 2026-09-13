import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are CyberShield AI Sentinel — an expert cybersecurity analyst and incident responder embedded in the CyberShield EDR platform.

You specialize in:
- Malware analysis, threat hunting, and forensic investigation
- MITRE ATT&CK framework techniques and mappings
- PowerShell and Bash remediation scripts
- Network threat analysis and containment
- Endpoint detection and response (EDR) guidance
- Zero-trust architecture recommendations

Guidelines:
- Be precise, technical, and actionable
- Use markdown formatting with code blocks for scripts/commands
- Always map threats to MITRE ATT&CK technique IDs (e.g. T1059.003)
- Provide confidence scores when analyzing threats
- Keep responses focused and under 400 words unless a full remediation script is needed`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, apiKey } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // Proceed to fallback if key is missing
    if (!geminiKey || geminiKey.trim().length < 10) {
      return NextResponse.json({
        success: true,
        text: `**⚠️ AI Service Temporarily Unavailable (API Key Missing)**\n\nGemini API could not be reached.\n\n**Offline Guidance:**\nFor threat analysis, check the Threat Radar and Forensics panels. Use the Malware Scanner to compute SHA-256 and Shannon entropy for suspicious files. Refer to MITRE ATT&CK at attack.mitre.org for technique details.\n\n*Verify your Gemini API key in Settings and ensure you have internet connectivity.*`,
        model: "LOCAL HEURISTIC ANALYSIS",
        confidence: 0,
      });
    }

    // Build conversation contents for Gemini
    const contents: any[] = [
      // System prompt as first user turn (Gemini doesn't have system role)
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I am CyberShield AI Sentinel. I am ready to assist with threat analysis, remediation, and cybersecurity guidance. How can I help you?",
          },
        ],
      },
    ];

    // Add conversation history
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg.sender === "user") {
          contents.push({ role: "user", parts: [{ text: msg.text }] });
        } else if (msg.sender === "ai") {
          contents.push({ role: "model", parts: [{ text: msg.text }] });
        }
      }
    }

    // Add current user message
    contents.push({ role: "user", parts: [{ text: message }] });

    // Try gemini-1.5-flash first, fall back to gemini-pro
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    let lastError = "";
    for (const model of models) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated.";

          return NextResponse.json({
            success: true,
            text,
            model,
            confidence: undefined,
          });
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${geminiRes.status}`;
        }
      } catch (fetchErr: any) {
        lastError = fetchErr.message;
      }
    }

    // All models failed — return fallback intelligence response
    return NextResponse.json({
      success: true,
      text: `**⚠️ AI Service Temporarily Unavailable**\n\nGemini API could not be reached: ${lastError}\n\n**Offline Guidance:**\nFor threat analysis, check the Threat Radar and Forensics panels. Use the Malware Scanner to compute SHA-256 and Shannon entropy for suspicious files. Refer to MITRE ATT&CK at attack.mitre.org for technique details.\n\n*Verify your Gemini API key in Settings and ensure you have internet connectivity.*`,
      model: "offline-fallback",
      confidence: 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
