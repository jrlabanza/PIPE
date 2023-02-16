import { query } from '../../lib/db'

const handler = async (req, res) => {
  try {
    const results = await query(`
      SELECT title, annoucement, status FROM annoucement WHERE isDeleted = ? ORDER BY id DESC
      `, 0
    )

    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
