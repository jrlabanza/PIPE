import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      pip_id,
      value
    } = req.body
    console.log(req.body)
      try {
        await query(
          `UPDATE pip SET isPIPEmployeeReady = ? WHERE formID = ?`,
          [
            value,
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
