import { query } from '../../lib/db'

const handler = async (req, res) => {
  const { id } = req.query
  try {
    if (!id) {
      return res.status(400).json({ message: '`id` required' })
    }
    if (typeof parseInt(id.toString()) !== 'number') {
      return res.status(400).json({ message: '`id` must be a number' })
    }
    const results = await query(
      `
      SELECT *
      FROM pip_goals
      WHERE pip_id = ?
    `,
      id
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
