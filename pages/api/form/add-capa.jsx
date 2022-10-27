import { query } from '../../../lib/db'
import { sendMail } from '../../../lib/nodemailer'

export default async (req, res) => {
  if (req.method === 'POST') {
    try{
      const {
        pip_id,
        goal_id,
        period,
        task,
        expected_start_date,
        expected_end_date
      } = req.body

      const results = await query(
        `
        INSERT INTO capa (
          pipID,
          goalID,
          period,
          task,
          start_date,
          end_date
          )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [ 
          pip_id,
          goal_id,
          period,
          task,
          expected_start_date,
          expected_end_date
        ]
      )

      return res.json(results)
    }
    catch (e) {
      res.status(500).json({ message: e.message })
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};
