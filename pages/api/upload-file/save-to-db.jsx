import { query } from '../../../lib/db'

export default async (req, res, next) => {
  if (req.method === 'POST') {
    try {
      const { 
        file,
        pip_id,
        goal_id,
        period,
        isSummary,
        remarks_query,
        remarks
      } = req.body

      file.map((data) => {
        query(
          `INSERT INTO uploads SET uploadName = ?, pipID = ?, goalID = ?, period = ?, isSummary = ?`,
          [
            data.filename,
            pip_id,
            goal_id,
            period,
            isSummary
          ] 
        )
      })
      
      res.status(200).json({ message: "success" })    
    }
    catch (err) {
      console.log(err)
    }
  } 
  else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};