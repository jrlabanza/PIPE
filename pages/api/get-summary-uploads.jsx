import { query } from '../../lib/db'

const handler = async (req, res) => {
  const { id } = req.query
 
  try {
    const results = await query(
      `SELECT * FROM uploads WHERE period = 0 AND pipID = ?`, id
    )
    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler