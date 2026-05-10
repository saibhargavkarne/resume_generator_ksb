import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipboardCopy, Download, Eye, Search, Trash2, X } from 'lucide-react'
import { DEFAULT_PROFILE_ID, getProfileById } from '../data/profiles'

const STATUS_OPTIONS = [
  'Waiting for Response',
  'Not Moving Forward',
  'Interview',
  'Not Chosen',
  'Offer'
]

const STATUS_STYLES = {
  'Waiting for Response': 'bg-slate-700/60 text-slate-300',
  'Not Moving Forward':   'bg-red-900/40 text-red-400',
  'Interview':            'bg-indigo-900/40 text-indigo-300',
  'Not Chosen':           'bg-orange-900/40 text-orange-400',
  'Offer':                'bg-emerald-900/40 text-emerald-400'
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso.includes('T') ? iso : iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getMonday(weeksAgo) {
  const now = new Date()
  const dow = now.getDay()
  const daysSinceMonday = dow === 0 ? 6 : dow - 1
  const thisMonday = new Date(now)
  thisMonday.setDate(now.getDate() - daysSinceMonday)
  thisMonday.setHours(0, 0, 0, 0)
  const target = new Date(thisMonday)
  target.setDate(thisMonday.getDate() - weeksAgo * 7)
  return target
}

function getLastSunday() {
  const lastMonday = getMonday(1)
  const sun = new Date(lastMonday)
  sun.setDate(lastMonday.getDate() + 6)
  sun.setHours(23, 59, 59, 999)
  return sun
}

function countInRange(submissions, startDate, endDate) {
  return submissions.filter((s) => {
    const d = new Date((s.submissionDate || s.date).includes('T')
      ? s.submissionDate || s.date
      : (s.submissionDate || s.date) + 'T00:00:00')
    return d >= startDate && d <= endDate
  }).length
}

async function loadDocxService() {
  const module = await import('../services/docxService')
  return module.default
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const [viewingJdId, setViewingJdId] = useState(null)
  const [jdModal, setJdModal] = useState({ open: false, title: '', content: '' })

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submissions?limit=500')
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setSubmissions(data.items || [])
    } catch {
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  const metrics = useMemo(() => {
    const lastSunday = getLastSunday()
    return {
      lastWeek:   countInRange(submissions, getMonday(1), lastSunday),
      last2Weeks: countInRange(submissions, getMonday(2), lastSunday),
      last3Weeks: countInRange(submissions, getMonday(3), lastSunday),
      last4Weeks: countInRange(submissions, getMonday(4), lastSunday),
      total:      submissions.length
    }
  }, [submissions])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return submissions.filter((s) => {
      const matchSearch = !q || [s.vendorCompany, s.clientName, s.pocName, s.pocEmail]
        .some((v) => v?.toLowerCase().includes(q))
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [submissions, searchTerm, statusFilter])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s))
    try {
      await fetch(`/api/submissions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
    } catch { /* optimistic update stays */ }
    setUpdatingId(null)
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await fetch(`/api/submissions?id=${id}`, { method: 'DELETE' })
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    } catch { /* noop */ }
    setDeletingId(null)
  }

  const handleViewJd = async (sub) => {
    setViewingJdId(sub.id)
    try {
      const res = await fetch(`/api/submissions?id=${sub.id}&fields=jd`)
      const data = await res.json()
      setJdModal({
        open: true,
        title: `${sub.clientName || sub.vendorCompany || 'Submission'} — JD`,
        content: data.jobDescription || 'No job description saved.'
      })
    } catch {
      setJdModal({ open: true, title: 'Error', content: 'Unable to load job description.' })
    }
    setViewingJdId(null)
  }

  const handleDownloadPdf = async (sub) => {
    setDownloadingId(sub.id)
    try {
      const res = await fetch(`/api/submissions?id=${sub.id}&fields=resume`)
      if (!res.ok) throw new Error('Fetch failed')
      const full = await res.json()
      const parsed = full.resumeJson
      if (!parsed) throw new Error('No resume stored')
      const profile = getProfileById(full.profileId || DEFAULT_PROFILE_ID)
      const resumeData = {
        personalInfo: profile.personalInfo,
        contactLocation: parsed.contactLocation || 'Dallas, TX',
        jobTitle: parsed.jobTitle || '',
        summary: parsed.professionalSummary,
        contractMode: Array.isArray(parsed.professionalSummary),
        skills: parsed.skills,
        experience: parsed.workExperience,
        education: profile.education,
        certifications: profile.certifications
      }
      const svc = await loadDocxService()
      await svc.generateResumePdfFile(resumeData, parsed.resumeMeta?.fileName || sub.fileName || 'Resume')
    } catch (err) {
      console.error('PDF download failed:', err)
    }
    setDownloadingId(null)
  }

  const TILE_DEFS = [
    { label: 'Last Week',   value: metrics.lastWeek   },
    { label: 'Last 2 Wks', value: metrics.last2Weeks  },
    { label: 'Last 3 Wks', value: metrics.last3Weeks  },
    { label: 'Last 4 Wks', value: metrics.last4Weeks  },
    { label: 'Total',       value: metrics.total       }
  ]

  return (
    <div className="space-y-6">
      {/* JD Modal */}
      {jdModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Job Description</h3>
                <p className="text-sm text-slate-400">{jdModal.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(jdModal.content)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400"
                >
                  <ClipboardCopy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setJdModal({ open: false, title: '', content: '' })}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-300">{jdModal.content}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Metric Tiles */}
      <div className="grid grid-cols-5 gap-3">
        {TILE_DEFS.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search vendor, client, POC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-slate-700 bg-slate-800 py-2.5 pl-4 pr-8 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={fetchSubmissions}
          className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-400 transition hover:text-white"
        >
          Refresh
        </button>
        <span className="text-sm text-slate-500">{filtered.length} of {submissions.length} submissions</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 px-8 py-12 text-center text-slate-400">
          Loading submissions...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 px-8 py-12 text-center text-slate-400">
          {submissions.length === 0 ? 'No submissions yet. Log your first vendor submission from the Generate tab.' : 'No submissions match the current filters.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                {['Date', 'Vendor Company', 'RTR', 'POC Name', 'POC Email', 'Client', 'Status', 'JD', 'PDF', ''].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, idx) => (
                <tr
                  key={sub.id}
                  className={`border-b border-slate-800/50 transition hover:bg-slate-800/30 ${idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/60'}`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDate(sub.submissionDate)}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{sub.vendorCompany || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">{sub.rtrAmount || '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{sub.pocName || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {sub.pocEmail ? (
                      <a href={`mailto:${sub.pocEmail}`} className="hover:text-indigo-400 transition">{sub.pocEmail}</a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{sub.clientName || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={sub.status || 'Waiting for Response'}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      disabled={updatingId === sub.id}
                      className={`rounded-xl border-0 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${STATUS_STYLES[sub.status] || STATUS_STYLES['Waiting for Response']}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewJd(sub)}
                      disabled={!sub.hasJobDescription || viewingJdId === sub.id}
                      className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-slate-800 px-3 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Eye className="h-3 w-3" />
                      JD
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDownloadPdf(sub)}
                      disabled={!sub.hasResume || downloadingId === sub.id}
                      className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-emerald-700/80 px-3 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Download className="h-3 w-3" />
                      PDF
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 transition hover:bg-red-900/30 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
