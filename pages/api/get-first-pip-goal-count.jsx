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
      SELECT COUNT(*) as periodCount
      FROM pip_goals
      WHERE pip_id = ? AND (first_period_employee_approval = 'APPROVED' AND first_period_department_head_approval = 'APPROVED')
    `,
      id
    )

    return res.json(results[0].periodCount)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
