import { query } from '../../../lib/db'
import { sendMail } from '../../../lib/nodemailer'

export default async (req, res) => {
  if (req.method === 'POST') {
    try{
      const {
        pip_id,
        target_area_for_improvement,
        expected_standards_of_performance,
        target,
        action_plan_to_improve_performance,
        support,
        first_expected_start_date,
        second_expected_start_date,
        third_expected_start_date,
        first_expected_end_date,
        second_expected_end_date,
        third_expected_end_date
      } = req.body
      
      const results = await query(
        `
        INSERT INTO pip_goals (
          pip_id,
          target_area_for_improvement,
          expected_standards_of_performance,
          target,
          action_plan_to_improve_performance,
          support,
          first_period_expected_start,
          second_period_expected_start,
          third_period_expected_start,
          first_period_expected_end,
          second_period_expected_end,
          third_period_expected_end
          )
        VALUES (
          ?,
          AES_ENCRYPT(?, 'pipencrypt'),
          AES_ENCRYPT(?, 'pipencrypt'),
          AES_ENCRYPT(?, 'pipencrypt'),
          AES_ENCRYPT(?, 'pipencrypt'),
          AES_ENCRYPT(?, 'pipencrypt'),
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
          target_area_for_improvement,
          expected_standards_of_performance,
          target,
          action_plan_to_improve_performance,
          support,
          first_expected_start_date,
          second_expected_start_date,
          third_expected_start_date,
          first_expected_end_date,
          second_expected_end_date,
          third_expected_end_date
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
