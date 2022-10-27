const nodemailer = require("nodemailer");


export async function sendMail(to, subject, html, cc) {

  let transporter = 
  nodemailer.createTransport({
    host: "mailhost.onsemi.com",
    port: 25,
    secure: false,
     auth: {
      user: 'apps.donotreply@onsemi.com',
      pass: 'Onsemi123!'
    }
  });

  const options = {
    from: '"E-PIP" <apps.donotreply@onsemi.com>',
    to: to,
    subject: subject, 
    html: html,
    cc: cc,
  }

  await transporter.sendMail(options, function (err, info){
    if(err){
      console.log(err)
      return
    }
    console.log(info.response)
  });
}

