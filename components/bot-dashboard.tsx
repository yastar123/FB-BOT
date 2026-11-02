'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Clock3,
  ExternalLink,
  Eye,
  Globe2,
  History,
  Info,
  Link2,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Square,
  Terminal,
  XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const initialLogs = [
  { time: '10:42:31', type: 'info', message: 'Job queued and waiting for an available worker' },
  { time: '10:42:32', type: 'success', message: 'Chromium browser launched successfully' },
  { time: '10:42:33', type: 'info', message: 'Navigating to facebook.com/watch/?v=847291' },
  { time: '10:42:35', type: 'success', message: 'Video player detected — ready for validation' },
  { time: '10:42:36', type: 'info', message: 'Collecting playback metadata and screenshot' },
]

const initialHistory = [
  { id: 'job_8f29a', url: 'facebook.com/watch/?v=847291', status: 'Running', duration: '00:12', date: 'Today, 10:42 AM' },
  { id: 'job_8f291', url: 'facebook.com/watch/?v=920183', status: 'Completed', duration: '01:08', date: 'Today, 09:18 AM' },
  { id: 'job_8f26c', url: 'facebook.com/watch/?v=114820', status: 'Completed', duration: '00:54', date: 'Yesterday, 04:26 PM' },
  { id: 'job_8f1d2', url: 'facebook.com/watch/?v=772011', status: 'Failed', duration: '00:31', date: 'Yesterday, 01:09 PM' },
]

function StatusDot({ status }: { status: string }) {
  const styles = status === 'Running' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : status === 'Failed' ? 'bg-red-400' : 'bg-sky-400'
  return <span className={`size-2 rounded-full ${styles}`} aria-hidden="true" />
}

function StatusBadge({ status }: { status: string }) {
  const icon = status === 'Running' ? <Activity data-icon="inline-start" /> : status === 'Completed' ? <CheckCircle2 data-icon="inline-start" /> : <XCircle data-icon="inline-start" />
  return <Badge variant={status === 'Failed' ? 'destructive' : status === 'Running' ? 'default' : 'secondary'} className="gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium">{icon}{status}</Badge>
}

export function BotDashboard() {
  const [url, setUrl] = useState('https://www.facebook.com/watch/?v=847291')
  const [status, setStatus] = useState('Running')
  const [activeTab, setActiveTab] = useState('overview')
  const [logs, setLogs] = useState(initialLogs)
  const [progress, setProgress] = useState(68)
  const [jobHistory, setJobHistory] = useState(initialHistory)
  const [notice, setNotice] = useState('')

  const statusCopy = useMemo(() => status === 'Running' ? 'Automation is actively validating the target video.' : status === 'Paused' ? 'Automation is paused. Resume when you are ready.' : 'Ready to validate an authorized video URL.', [status])

  async function startJob() {
    try {
      const parsedUrl = new URL(url)
      if (!parsedUrl.hostname.endsWith('facebook.com')) throw new Error('Use a facebook.com video URL.')
    } catch {
      setNotice('Enter a valid facebook.com video URL before starting a job.')
      return
    }

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) {
      setNotice('The job could not be queued. Check the URL and try again.')
      return
    }
    const queuedJob = await response.json()
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const jobId = queuedJob.id as string
    setNotice('Job queued successfully. The worker will pick it up next.')
    setStatus('Running')
    setProgress(18)
    setLogs([{ time, type: 'info', message: `Job ${jobId} queued for ${new URL(url).pathname}` }, ...logs])
    setJobHistory([{ id: jobId, url: new URL(url).hostname + new URL(url).pathname, status: 'Running', duration: '00:00', date: 'Just now' }, ...jobHistory])
  }

  function stopJob() {
    setStatus('Cancelled')
    setProgress(0)
    setLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: 'warning', message: 'Job cancellation requested by admin' }, ...logs])
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-950 selection:bg-slate-200">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20"><Play className="size-4 fill-white text-slate-950" /></div>
              <div><div className="text-[15px] font-semibold tracking-tight">FB Video Bot</div><div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Automation console</div></div>
            </div>
            <nav className="hidden items-center gap-1 md:flex"><Button variant="secondary" size="sm" className="bg-slate-100 text-slate-950 hover:bg-slate-200">Dashboard</Button><Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-950"><History data-icon="inline-start" /> Activity</Button><Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-950"><Settings2 data-icon="inline-start" /> Settings</Button></nav>
          </div>
          <div className="flex items-center gap-4"><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><span className="size-2 rounded-full bg-emerald-400" /> Worker online</div><Separator orientation="vertical" className="hidden h-5 bg-slate-200 sm:block" /><div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-600 text-xs font-semibold">AD</div><Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-950"><MoreHorizontal /></Button></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><span>Workspace</span><span>/</span><span className="text-slate-700">Dashboard</span></div><h1 className="text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">Good morning, Admin</h1><p className="mt-1 text-sm text-slate-500">Monitor your browser automation jobs and workers.</p></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950"><RefreshCw data-icon="inline-start" /> Refresh</Button><Button size="sm" className="bg-violet-600 text-slate-950 hover:bg-violet-500"><Plus data-icon="inline-start" /> New job</Button></div></div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active jobs', '01', '+1 from last hour', Activity, 'text-emerald-400'],
            ['Completed today', '24', '+18.2% vs yesterday', CheckCircle2, 'text-sky-400'],
            ['Failed today', '02', '8.3% failure rate', AlertTriangle, 'text-amber-400'],
            ['Avg. duration', '00:58', '-12s vs last week', Clock3, 'text-violet-400'],
          ].map(([label, value, sub, Icon, color]) => <Card key={label as string} className="border-slate-200/80 bg-white shadow-none"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{label as string}</span><Icon className={`size-4 ${color}`} /></div><div className="text-2xl font-semibold tracking-tight text-slate-950">{value as string}</div><div className="mt-1 text-[11px] text-slate-500">{sub as string}</div></CardContent></Card>)}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
          <Card className="overflow-hidden border-slate-200/80 bg-white shadow-none"><CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/80 px-6 py-5"><div><CardTitle className="text-base text-slate-950">Automation control</CardTitle><p className="mt-1 text-xs text-slate-500">Run a safe authorized-video validation job in preview mode.</p></div><Badge variant="outline" className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><ShieldCheck data-icon="inline-start" /> Authorized testing</Badge></CardHeader><CardContent className="p-6"><div className="flex flex-col gap-5"><div><label htmlFor="video-url" className="mb-2 block text-xs font-medium text-slate-700">Facebook video URL</label><div className="flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><Input id="video-url" value={url} onChange={(e) => setUrl(e.target.value)} className="h-11 border-slate-200 bg-slate-50 pl-10 text-sm text-slate-700 placeholder:text-slate-600" placeholder="https://facebook.com/watch/?v=..." /></div><Button onClick={startJob} className="h-11 bg-violet-600 px-5 text-slate-950 hover:bg-violet-500"><Play data-icon="inline-start" /> Start bot</Button></div><p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500"><Info className="size-3" /> Only test videos you own or are authorized to access.</p></div><div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2.5"><StatusDot status={status} /><span className="text-sm font-medium text-slate-950">Current job</span><span className="font-mono text-[10px] text-slate-500">job_8f29a</span></div><StatusBadge status={status} /></div><div className="mb-4 grid gap-4 sm:grid-cols-3"><div><div className="mb-1 text-[10px] uppercase tracking-wider text-slate-600">Target</div><div className="flex items-center gap-1.5 truncate text-xs text-slate-700"><Globe2 className="size-3 text-slate-500" />{url.replace('https://www.', '').slice(0, 29)}</div></div><div><div className="mb-1 text-[10px] uppercase tracking-wider text-slate-600">Browser</div><div className="flex items-center gap-1.5 text-xs text-emerald-300"><Server className="size-3" /> Chromium / headless</div></div><div><div className="mb-1 text-[10px] uppercase tracking-wider text-slate-600">Duration</div><div className="flex items-center gap-1.5 text-xs text-slate-700"><Clock3 className="size-3 text-slate-500" /> 00:12.4</div></div></div><Progress value={progress} className="h-1.5 bg-slate-100 [&>div]:bg-violet-500" /><div className="mt-2 flex justify-between text-[10px] text-slate-600"><span>Validating player</span><span>{progress}%</span></div></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setStatus(status === 'Paused' ? 'Running' : 'Paused')} disabled={status === 'Cancelled'} className="border-slate-200 bg-transparent text-slate-700 hover:bg-white/[0.06] hover:text-slate-950"><Pause data-icon="inline-start" /> {status === 'Paused' ? 'Resume' : 'Pause'}</Button><Button variant="outline" size="sm" onClick={stopJob} disabled={status === 'Cancelled'} className="border-red-400/20 bg-transparent text-red-300 hover:bg-red-400/10"><Square data-icon="inline-start" /> Stop job</Button><Button variant="ghost" size="sm" className="ml-auto text-slate-500 hover:text-slate-950"><ExternalLink data-icon="inline-start" /> View screenshot</Button></div></div></CardContent></Card>

          <Card className="border-slate-200/80 bg-white shadow-none"><CardHeader className="border-b border-slate-200/80 px-6 py-5"><div className="flex items-center justify-between"><div><CardTitle className="text-base text-slate-950">Execution logs</CardTitle><p className="mt-1 text-xs text-slate-500">Live events from the active worker.</p></div><div className="flex size-7 items-center justify-center rounded-md bg-violet-500/10 text-violet-300"><Terminal className="size-3.5" /></div></div></CardHeader><CardContent className="p-0"><div className="max-h-[286px] overflow-auto p-5">{logs.map((log, index) => <div key={`${log.time}-${index}`} className="flex gap-3 border-l border-slate-200 pb-4 pl-4 last:pb-0"><div className={`-ml-[21px] mt-1 size-2 rounded-full border-2 border-white ${log.type === 'success' ? 'bg-emerald-400' : log.type === 'warning' ? 'bg-amber-400' : 'bg-sky-400'}`} /><div className="min-w-0"><div className="mb-1 flex items-center gap-2"><span className="font-mono text-[10px] text-slate-600">{log.time}</span>{log.type === 'success' && <CheckCircle2 className="size-3 text-emerald-400" />}</div><p className="text-xs leading-relaxed text-slate-700">{log.message}</p></div></div>)}</div><div className="border-t border-slate-200/80 px-5 py-3"><Button variant="ghost" size="sm" className="h-7 px-0 text-[11px] text-slate-500 hover:text-slate-950">View all logs <ExternalLink data-icon="inline-end" /></Button></div></CardContent></Card>
        </div>

        <Card className="mt-6 border-slate-200/80 bg-white shadow-none"><CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/80 px-6 py-5"><div><CardTitle className="text-base text-slate-950">Job history</CardTitle><p className="mt-1 text-xs text-slate-500">Recent validation runs from your workspace.</p></div><div className="flex items-center gap-2"><div className="relative hidden sm:block"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-600" /><Input className="h-8 w-48 border-slate-200 bg-slate-50 pl-8 text-xs" placeholder="Search jobs..." /></div><Button variant="outline" size="sm" className="h-8 border-slate-200 bg-transparent text-xs text-slate-500"><Settings2 data-icon="inline-start" /> Filter</Button></div></CardHeader><CardContent className="p-0"><Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"><div className="border-b border-slate-200/80 px-6"><TabsList className="h-11 bg-transparent p-0"><TabsTrigger value="overview" className="h-11 rounded-none border-b-2 border-transparent px-1 mr-5 text-xs text-slate-500 data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-slate-950">All jobs</TabsTrigger><TabsTrigger value="running" className="h-11 rounded-none border-b-2 border-transparent px-1 mr-5 text-xs text-slate-500 data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-slate-950">Running <span className="ml-1.5 rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[10px] text-violet-300">1</span></TabsTrigger><TabsTrigger value="failed" className="h-11 rounded-none border-b-2 border-transparent px-1 text-xs text-slate-500 data-[state=active]:border-violet-500 data-[state=active]:bg-transparent data-[state=active]:text-slate-950">Failed</TabsTrigger></TabsList></div></Tabs><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-white/[0.05] text-[10px] uppercase tracking-wider text-slate-600"><th className="px-6 py-3 font-medium">Job ID</th><th className="px-6 py-3 font-medium">Target URL</th><th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium">Duration</th><th className="px-6 py-3 font-medium">Started</th><th className="px-6 py-3" /></tr></thead><tbody>{jobHistory.filter((job) => activeTab === 'overview' || (activeTab === 'running' ? job.status === 'Running' : job.status === 'Failed')).map((job) => <tr key={job.id} className="border-b border-white/[0.04] text-xs transition-colors hover:bg-white/[0.02]"><td className="px-6 py-4 font-mono text-slate-500">{job.id}</td><td className="max-w-[260px] truncate px-6 py-4 text-slate-700">{job.url}</td><td className="px-6 py-4"><StatusBadge status={job.status} /></td><td className="px-6 py-4 font-mono text-slate-500">{job.duration}</td><td className="px-6 py-4 text-slate-500">{job.date}</td><td className="px-6 py-4 text-right"><Button variant="ghost" size="icon" className="size-7 text-slate-600 hover:text-slate-950"><MoreHorizontal /></Button></td></tr>)}</tbody></table></div></CardContent></Card>
        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-slate-200/80 pt-5 text-[11px] text-slate-600 sm:flex-row sm:items-center"><div className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-emerald-500" /> Server-side automation is isolated and rate-limited.</div><div className="flex items-center gap-4"><span>Worker v1.4.2</span><span>•</span><span>Last heartbeat 3s ago</span><CircleHelp className="size-3.5" /></div></div>
      </main>
    </div>
  )
}
