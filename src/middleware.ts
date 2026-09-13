import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// MVP Zero-Trust Token
const API_TOKEN = "CS-AGENT-SECRET-2026"

export function middleware(request: NextRequest) {
  // Only apply Zero-Trust authentication to API mutation routes
  if (
    request.nextUrl.pathname.startsWith('/api/') && 
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
  ) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || authHeader !== `Bearer ${API_TOKEN}`) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Unauthorized: Missing or Invalid Zero-Trust Token' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
