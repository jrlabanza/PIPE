import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      remarks,
      pip_id
    } = req.body

      try {
        await query(
          `UPDATE pip SET supervisor_remarks = ? WHERE formID = ?`,
          [
            remarks,
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
