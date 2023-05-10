import { query } from '../../lib/db'

const handler = async (req, res) => {
  const { ffid } = req.query
  try {
    const results = await query(
      `
      SELECT *
      FROM pip WHERE originator_ffid = ? AND isDeleted = 0 ORDER BY id DESC
      `,
      ffid
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
