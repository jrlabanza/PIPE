import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      id,
      current_status,
      end_program_status
    } = req.body
      try {
        await query(
          `UPDATE pip SET current_status = ?, evaluation_rate = ? WHERE id = ?`,
          [
            current_status,
            end_program_status,
            id
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
