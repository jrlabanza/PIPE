import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const { id } = req.body
    try {
      const results = await query(
        `
        SELECT *
        FROM pip
        WHERE id = ? AND (department_head_approval_status = "ACKNOWLEDGED" AND hr_manager_approval_status = "ACKNOWLEDGED") AND isDeleted = 0
      `,
        id
      )
      
      results.length > 0 ? await query(
        `
        UPDATE pip SET current_status = "FINAL EMPLOYEE SIGNOFF" WHERE id = ? AND isDeleted = 0
      `,
        id
      ) : null

      const results2 = await query(
        `
        SELECT *
        FROM pip
        WHERE id = ? AND (department_head_approval_status = "ACKNOWLEDGED" AND hr_manager_approval_status = "ACKNOWLEDGED" AND employee_approval_status = "ACKNOWLEDGED") AND isDeleted = 0
      `,
        id
      )

      results2.length > 0 ? await query(
        `
        UPDATE pip SET current_status = "PROGRAM CLOSED" WHERE id = ? AND isDeleted = 0
      `,
        id
      ) : null

    }catch(e){
      res.status(500).json(e)
    } 
  }else {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
