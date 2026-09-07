import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { incidentId, incidentDetails, apiKey } = body;

    if (!incidentDetails) {
      return NextResponse.json(
        { success: false, error: "Incident details are required" },
        { status: 400 }
      );
    }

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey.length > 20) {
      const model = "gemini-3.6-flash"; // default model
      
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are CyberShield AI Sentinel — a cybersecurity incident responder and email threat intelligence specialist.
Analyze the following incident which correlated an email threat with an endpoint execution event.
Incident Details: ${JSON.stringify(incidentDetails)}

Return a structured JSON object exactly matching this schema (do NOT use markdown wrappers around the JSON, just return raw JSON):
{
  "executiveSummary": "string",
  "threatActorAttribution": "string",
  "attackPath": ["string array of steps"],
  "mitreTechniques": ["string array of T-codes with description"],
  "remediationSteps": ["string array of actionable commands or steps"],
  "confidenceScore": number (0-100)
}
`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (responseText) {
            // strip markdown formatting if the model adds it
            responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            console.log("Raw Gemini Response:", responseText);
            const structuredReport = JSON.parse(responseText);
            
            return NextResponse.json({
              success: true,
              report: structuredReport
            });
          }
        } else {
            console.error("Gemini API Error Status:", geminiRes.status, await geminiRes.text());
        }
      } catch (geminiErr) {
        console.warn(`Gemini API failed:`, geminiErr);
      }
    }

    // If we reach here, generation failed or key was invalid
    return NextResponse.json(
      { success: false, error: "Failed to generate AI report or invalid configuration" },
      { status: 500 }
    );
    
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to generate AI report" },
      { status: 500 }
    );
  }
}
