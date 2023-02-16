import { query } from '../../../lib/db'

const handler = async (req, res) => {
  const { dept_code } = req.body
  try {
    const results = await query(
      `
        SELECT *
        FROM department_head_list
        WHERE dept_code = ?
      `,
      dept_code
    )

    return res.json(results[0])
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
