import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      id
    } = req.body
      try {
        await query(
          `UPDATE capa SET isDeleted = 1 WHERE id = ?`,
          [
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
