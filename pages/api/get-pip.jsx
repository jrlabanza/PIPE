import { query } from '../../lib/db'

const handler = async (req, res) => {
  try {
    const results = await query(
      `
      SELECT *
      FROM pip WHERE isDeleted = 0 ORDER BY id DESC
      `
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
