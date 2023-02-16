import { query } from '../../../lib/db'

const handler = async (req, res) => {
  const { username } = req.body
  try {
    const results = await query(
      `
        SELECT COUNT(*) as is_admin
        FROM users
        WHERE ffid = ? AND is_admin = 1
      `,
      username
    )

    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
