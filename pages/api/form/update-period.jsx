import { query } from '../../../lib/db'
import { sendMail } from '../../../lib/nodemailer';

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      startDate,
      endDate,
      id,
      startQuery,
      endQuery,
      remarks,
      period,
      goalID,
      remarksQuery
    } = req.body
    if(startDate || endDate){
      let queryString = `UPDATE pip_goals SET `

      if(startDate){
        queryString += `${startQuery} = '${startDate}'`
      }
  
      if(endDate){
        if(startDate){
          queryString += `, `
        }
        queryString += `${endQuery} = '${endDate}'`
      }   
  
      queryString += ` WHERE id = ${goalID}`
  
      try {
        query(
          queryString,
        )
        const updateRemarks = await query(`UPDATE pip_goals SET ${remarksQuery} = '${remarks}' WHERE id = ${goalID}`)
        console.log(updateRemarks)
        const getResult = await query(`SELECT * FROM pip WHERE id = ?`, id)
        // For Prod
        // var to = getResult[0].originator_mail
        var to = getResult[0].originator_mail+","+getResult[0].department_head_mail+","+getResult[0].employee_mail
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
          <p>E-PIP has reached Periodic Sign Off, please review the current evaluation and is waiting for your acknowledgement</p>
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
              <td><a href='${process.env.NEXT_PUBLIC_HOST_ADDRESS}:${process.env.NEXT_PUBLIC_PORT}/viewPIP?ID=${getResult[0].formID}'>VIEW</a></td>
            </tr>
          </table>
          <br>
          <br>
          <p style='color:red'>This is an automated mail, Please do not reply.</p>
          <p>Applications Engineering | E-PIP</p>
        ` 
  
        sendMail(to,getResult[0].current_status,body)
        res.json("success")
      }catch(e){
        res.status(500).json(e)
      } 
    }
  }else {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}
