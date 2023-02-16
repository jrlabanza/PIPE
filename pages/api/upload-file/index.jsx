import multer from 'multer'

// disable next.js' default body parser
export const config = {
   api: {
      bodyParser: false
   }
}

export default async function handler(req, res) {
  try {
    await new Promise(resolve => {
      const mw = multer(
        {
            storage: multer.diskStorage({
              destination: './uploads',
              filename: function (req, file, cb) {
                const newName = Date.now()+"."+file.originalname.split('.').reverse()[0]
                return cb(null, newName)
              }
            }),
        }
      ).any()
      mw(req, res, resolve)

   })
    //  console.log(req.body)
    res.status(200).json({
      file: req.files
    })
  }
  catch (err) {
    res.status(500).json({
      message: err
    })
  }
}




