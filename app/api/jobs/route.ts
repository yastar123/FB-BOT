import { NextResponse } from 'next/server'

const jobs = new Map<string, { id: string; url: string; status: 'queued' | 'running' | 'completed'; createdAt: string }>()

function isAuthorizedFacebookUrl(value: unknown) {
  if (typeof value !== 'string') return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' && (parsed.hostname === 'facebook.com' || parsed.hostname.endsWith('.facebook.com'))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!isAuthorizedFacebookUrl(body?.url)) {
    return NextResponse.json({ error: 'Only valid HTTPS facebook.com URLs are accepted.' }, { status: 400 })
  }

  const id = `job_${crypto.randomUUID().slice(0, 6)}`
  const job = { id, url: body.url, status: 'queued' as const, createdAt: new Date().toISOString() }
  jobs.set(id, job)
  return NextResponse.json(job, { status: 202 })
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ jobs: [...jobs.values()] })
  const job = jobs.get(id)
  if (!job) return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
  return NextResponse.json(job)
}
