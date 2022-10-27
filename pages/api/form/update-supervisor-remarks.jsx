import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      remarks,
      pip_id,
      goal_id,
    } = req.body

      try {
        await query(
          `UPDATE pip_goals SET supervisor_remarks = ? WHERE id = ? AND pip_id = ?`,
          [
            remarks,
            goal_id,
            pip_id
          ]
        )
        res.json("success")
      }catch(e){
        res.status(500).json(e)
      } 
    
    
  }else {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
