import { sendMail } from '../../../lib/nodemailer'

export  function mail (){
  if (req.method === 'POST') {
    const {subject} = req.body

    return res.json(result);
  }
}
