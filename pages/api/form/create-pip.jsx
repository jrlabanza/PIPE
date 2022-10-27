import { query } from '../../../lib/db'
import { sendMail } from '../../../lib/nodemailer';

export default async (req, res) => {
  if (req.method === 'POST') {
    try{
      const {
        formID,
        user_name,
        mail,
        job_title,
        department_code,
        originator,
        originator_ffid,
        current_status,
        originator_mail,
        department_head_mail,
        department_head_name,
        department_head_ffid,
        employee_ffid
      } = req.body

      const getHRAdmin = await query(
        `
          SELECT * FROM users WHERE is_hr_admin = 1 
        `
      )

      const results = await query(
        `
        INSERT INTO pip (
          formID,
          employee_name,
          employee_mail,
          employee_title,
          employee_departmentcode,
          originator,
          originator_ffid,
          current_status,
          originator_mail,
          department_head_mail,
          department_head_name,
          department_head_ffid,
          employee_ffid,
          hr_manager_name,
          hr_manager_mail,
          hr_manager_ffid
          )
        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [ 
          formID,
          user_name,
          mail,
          job_title,
          department_code,
          originator,
          originator_ffid,
          current_status,
          originator_mail,
          department_head_mail,
          department_head_name,
          department_head_ffid,
          employee_ffid,
          getHRAdmin[0].name,
          getHRAdmin[0].mail,
          getHRAdmin[0].ffid
        ]
      )
      // For Prod
      var to = originator_mail+","+department_head_mail
      var body =`  
      <style>
        body
        {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        
        tr:nth-child(even) {
          background-color: #dddddd;
        }
      </style>
      <p>Good day,</p>
      <p> An E-PIP Form has been created, please be advised of the progression of the PIP. </p>
      <p>Please use Google Chrome or Mozilla FireFox</p>
      
      <br>
      <br>
      <table style='width:60%'>
        <tr>
          <th>STATUS</th>
          <th>EMPLOYEE NAME</th>
          <th>DEPARTMENT CODE</th>
          <th>ACTION</th>
        </tr>
        <tr>
          <td>${current_status}</td>
          <td>${user_name}</td>
          <td>${department_code}</td>
          <td><a href='${process.env.NEXT_PUBLIC_HOST_ADDRESS}:${process.env.NEXT_PUBLIC_PORT}/view?pipID=${formID}'>VIEW</a></td>
        </tr>
      </table>
      <br>
      <br>
      <p style='color:red'>This is an automated mail, Please do not reply.</p>
      <p>Applications Engineering | E-PIP</p>
      ` 
  
      sendMail(
        to,
        current_status,
        body
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
