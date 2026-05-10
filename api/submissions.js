import { Redis } from '@upstash/redis'
import { requireAuthenticatedSession } from './_lib/auth.js'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

function parseStoredValue(value) {
  return typeof value === 'string' ? JSON.parse(value) : value
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!requireAuthenticatedSession(req, res)) return

  if (req.method === 'GET') {
    const { id, fields, cursor, limit } = req.query

    if (id) {
      if (fields === 'jd') {
        const jd = await redis.get(`subjd:${id}`)
        return res.status(200).json({ jobDescription: typeof jd === 'string' ? jd : '' })
      }
      if (fields === 'resume') {
        const [meta, resumeJson] = await Promise.all([
          redis.get(`submeta:${id}`),
          redis.get(`subresume:${id}`)
        ])
        if (!meta) return res.status(404).json({ error: 'Not found' })
        const parsedMeta = parseStoredValue(meta)
        return res.status(200).json({
          id: parsedMeta.id,
          fileName: parsedMeta.fileName,
          profileId: parsedMeta.profileId,
          resumeJson: parseStoredValue(resumeJson)
        })
      }
      const meta = await redis.get(`submeta:${id}`)
      if (!meta) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(parseStoredValue(meta))
    }

    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 200, 1), 500)
    const startIndex = Math.max(parseInt(cursor, 10) || 0, 0)
    const endIndex = startIndex + pageLimit - 1

    const [ids, total] = await Promise.all([
      redis.lrange('sub:index', startIndex, endIndex),
      redis.llen('sub:index')
    ])

    if (!ids || ids.length === 0) {
      return res.status(200).json({ items: [], total: total || 0, nextCursor: null, hasMore: false })
    }

    const metas = await Promise.all(ids.map((id) => redis.get(`submeta:${id}`)))
    const items = metas.filter(Boolean).map(parseStoredValue)
    const nextCursor = startIndex + ids.length

    return res.status(200).json({
      items,
      total,
      nextCursor: nextCursor < total ? nextCursor : null,
      hasMore: nextCursor < total
    })
  }

  if (req.method === 'POST') {
    const {
      submissionDate, vendorCompany, rtrAmount,
      pocName, pocEmail, clientName, status,
      fileName, profileId, resumeJson, jobDescription
    } = req.body

    const id = Date.now().toString()
    const date = new Date().toISOString()

    const metaRecord = {
      id,
      date,
      submissionDate: submissionDate || date.split('T')[0],
      vendorCompany: vendorCompany || '',
      rtrAmount: rtrAmount || '',
      pocName: pocName || '',
      pocEmail: pocEmail || '',
      clientName: clientName || '',
      status: status || 'Waiting for Response',
      fileName: fileName || '',
      profileId: profileId || '',
      hasJobDescription: Boolean(jobDescription?.trim()),
      hasResume: Boolean(resumeJson)
    }

    await redis.set(`submeta:${id}`, JSON.stringify(metaRecord))
    if (jobDescription?.trim()) await redis.set(`subjd:${id}`, jobDescription)
    if (resumeJson) await redis.set(`subresume:${id}`, JSON.stringify(resumeJson))
    await redis.lpush('sub:index', id)

    return res.status(201).json({ id })
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id is required' })

    const meta = await redis.get(`submeta:${id}`)
    if (!meta) return res.status(404).json({ error: 'Not found' })

    const updated = { ...parseStoredValue(meta), ...req.body }
    await redis.set(`submeta:${id}`, JSON.stringify(updated))
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id is required' })

    await Promise.all([
      redis.del(`submeta:${id}`),
      redis.del(`subjd:${id}`),
      redis.del(`subresume:${id}`),
      redis.lrem('sub:index', 0, id)
    ])
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
