import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role, company } = body

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and role are required.' },
        { status: 400 }
      )
    }

    const railwayApiUrl = process.env.RAILWAY_API_URL
    if (!railwayApiUrl) {
      console.error('RAILWAY_API_URL environment variable is not set')
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      )
    }

    const response = await fetch(`${railwayApiUrl}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, role, company }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to join waitlist. Please try again.' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
