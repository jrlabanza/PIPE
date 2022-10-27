import { query } from '../../../lib/db'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      id,
      remarks,
      remarksQuery,
      approvalQuery,
      status,
      dateQuery
    } = req.body

    try {
      await query(
        `UPDATE pip_goals SET `+remarksQuery+` = ?, `+approvalQuery+` = ?, `+ dateQuery +` = NOW()  WHERE id = ?`,
        [
          remarks,
          status,
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
