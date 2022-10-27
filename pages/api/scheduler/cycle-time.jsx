import { query } from '../../../lib/db'
import { sendMail } from '../../../lib/nodemailer'

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      gsen_ID,
      validQuotationDate,
    } = req.body

    query(
      `
        INSERT INTO cron_job (expiration, gsen_ID) VALUES (? , ?);
      `,
      [
        validQuotationDate,
        gsen_ID
      ]
    )

  }
  else if (req.method === 'GET'){
    try {
    
      const formData = await query(
        `
        SELECT *
        FROM gsen_form
        WHERE curdate() > date_add(DATE(date_submitted), interval 14 day) 
        AND (status = 'SUPERVISOR APPROVAL' OR status = 'DEPARTMENT HEAD APPROVAL' OR status = 'BUYER APPROVAL') 
        AND isDeleted = 0;
        `
      )

      query(
        `
        UPDATE gsen_form
        SET status = 'CANCELLED'
        WHERE curdate() > date_add(DATE(date_submitted), interval 14 day) 
        AND (status = 'SUPERVISOR APPROVAL' OR status = 'DEPARTMENT HEAD APPROVAL' OR status = 'BUYER APPROVAL') 
        AND isDeleted = 0;
        `
      )
      
      var count = Object.keys(formData).length
      for(var i = 0; i < count ; i ++){

        var body =  "<style>"+
        "  body{"+
        "    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"+
        "  }"+
        "  table, th, td {"+
        "    border:1px solid black;"+
        "  }"+
        "td, th {"+
        "  border: 1px solid #dddddd;"+
        "  text-align: left;"+
        "  padding: 8px;"+
        "}"+
        "</style>"+
        "<p>Hi Good Day!, </p>"+
        "</br>"+
        "<p> You have a current GSEN Form to be reviewed. </p>"+
        "<p>Please use Google Chrome or Mozilla FireFox</p>"+
        "<a href='http://phsm01ws014.ad.onsemi.com:3112/view?gsenID="+formData[i].id+"'>VIEW</a>"+
        "<br>"+
        "<br>"+
        "<table style='width:60%'>"+
          "<tr>"+
            "<th>GSEN-ID</th>"+
            "<th>CATEGORY</th>"+
            "<th>SUBMITTER</th>"+
            "<th>STATUS</th>"+
          "</tr>"+
          "<tr>"+
            "<td>"+formData[i].gsen_ID+"</td>"+
            "<td>"+formData[i].category+"</td>"+
            "<td>"+formData[i].submitter+"</td>"+
            "<td>CANCELLED</td>"+
          "</tr>"+
        "</table>"+
        "<br>"+
        "<br>"+
        "<p style='color:red'>Please do not reply.</p>"+
        "<p>Applications Engineering | GSEN</p>" 

        sendMail( //Send Mail
          formData[0].submitterEmail,
          "CANCELLED",
          body
        )
        //(data.id).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})
      }
      res.json({
        message: 'Update Success! total of '+ count +' forms have been updated',
        status: 200,
        date_executed: new Date()
      })
  
    } catch (e) {
      res.json({
        message: e.message,
        status: 503,
        date_executed: new Date()
      })
    }
  }
}
