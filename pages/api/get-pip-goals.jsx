import { query } from '../../lib/db'

const handler = async (req, res) => {
  const { id } = req.query
  try {
    if (!id) {
      return res.status(400).json({ message: '`id` required' })
    }
    if (typeof parseInt(id.toString()) !== 'number') {
      return res.status(400).json({ message: '`id` must be a number' })
    }
    const results = await query(
      `
      SELECT 
        id,
        pip_id, 
        CAST(AES_DECRYPT(target_area_for_improvement, 'pipencrypt')AS CHAR) AS target_area_for_improvement,
        CAST(AES_DECRYPT(expected_standards_of_performance, 'pipencrypt')AS CHAR) AS expected_standards_of_performance,
        CAST(AES_DECRYPT(target, 'pipencrypt')AS CHAR) AS target,
        CAST(AES_DECRYPT(action_plan_to_improve_performance, 'pipencrypt')AS CHAR) AS action_plan_to_improve_performance, 
        CAST(AES_DECRYPT(support, 'pipencrypt')AS CHAR) AS support,
        first_period_expected_start,
        first_period_expected_end,
        second_period_expected_start,
        second_period_expected_end,
        third_period_expected_start,
        third_period_expected_end,
        overall_status,
        first_period_employee_approval,
        first_period_department_head_approval,
        second_period_employee_approval,
        second_period_department_head_approval,
        third_period_employee_approval,
        third_period_department_head_approval,
        first_period_actual_start,
        first_period_actual_end,
        second_period_actual_start,
        second_period_actual_end,
        third_period_actual_start,
        third_period_actual_end,
        first_period_employee_approval_date,  
        first_period_employee_approval_remarks, 
        first_period_department_head_approval_date, 
        first_period_department_head_approval_remarks, 
        second_period_employee_approval_date, 
        second_period_employee_approval_remarks, 
        second_period_department_head_approval_date, 
        second_period_department_head_approval_remarks, 
        third_period_employee_approval_date, 
        third_period_employee_approval_remarks, 
        third_period_department_head_approval_date, 
        third_period_department_head_approval_remarks, 
        has_first_period_capa, 
        has_second_period_capa, 
        has_third_period_capa, 
        supervisor_remarks, 
        first_period_supervisor_remarks,  
        second_period_supervisor_remarks, 
        third_period_supervisor_remarks
      FROM pip_goals
      WHERE pip_id = ?
    `,
      id
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
