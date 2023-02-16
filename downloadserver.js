// Requiring express package for routing
const express = require('express')
require('dotenv').config({path:`.env.local`})
 
// Creating app
const app = express();
 
// The folder path for the files
const folderPath = __dirname+'/uploads';
 
app.get('/:filename',function(req,res) {
       
    // Download function provided by express
    res.download(folderPath+'/'+req.params.filename, function(err) {
        if(err) {
            console.log(err);
        }
    })
  })
// Server configuration
app.listen(process.env.DOWNLOAD_PORT,function(req,res){
    console.log('Server started to listen at '+process.env.DOWNLOAD_PORT);
})