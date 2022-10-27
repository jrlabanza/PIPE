import { query } from '../../../lib/db'
import { sendMail } from '../../../lib/nodemailer'

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
        `UPDATE pip SET `+remarksQuery+` = ?, `+approvalQuery+` = ?, `+ dateQuery +` = NOW()  WHERE id = ?`,
        [
          remarks,
          status,
          id
        ]
      )
      const getResult = await query(`SELECT * FROM pip WHERE id = ?`, id)
      
      if(getResult[0].department_head_approval_status == "APPROVED" && getResult[0].hr_manager_approval_status == "APPROVED"){
        var to = getResult[0].employee_mail
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
          <p>E-PIP has reached Final Employee Sign-Off, please review the current evaluation and is waiting for your acknowledgement</p>
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
              <td>${getResult[0].current_status}</td>
              <td>${getResult[0].employee_name}</td>
              <td>${getResult[0].employee_departmentcode}</td>
              <td><a href='http://phsm01ws014.ad.onsemi.com:3115/view?pipID=${getResult[0].formID}'>VIEW</a></td>
            </tr>
          </table>
          <br>
          <br>
          <p style='color:red'>This is an automated mail, Please do not reply.</p>
          <p>Applications Engineering | E-PIP</p>
        ` 

        sendMail(to,getResult[0].current_status,body)
      }

      res.json({"message": "success",id: id})
    }catch(e){
      res.status(500).json(e)
    } 
  }else {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
