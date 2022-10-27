import { masterlistQuery } from '../../lib/db'

const handler = async (req, res) => {
  const { department } = req.query
  try {
    const results = await masterlistQuery(
      `SELECT * FROM sob_db.masterlist WHERE department_head = 'Department Head' AND deptCode = ?`,
      [
        department
      ]
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
