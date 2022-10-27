export default function handler(req, res) {
  if (req.method === 'POST') {
    var ldap = require('ldapjs')
    const {
      username,
      password,
      searchQuery,
    } = req.body
    try {
      var client = ldap.createClient({
        url: 'ldap://ad.onsemi.com',
        reconnect: true
      })
  
      client.bind("onsemi"+"\\"+username, password, function(err){
  
        if(err){
          res.json({
            "status_code": 500,
            "error_message": err
          })
        }
        else{
          var searchOptions = {
            filter: "(|(displayname="+searchQuery+"*)(sn="+searchQuery+"*)(sAMAccountName="+searchQuery+"))",
            //filter: "(&(objectClass=user)(objectCategory=person)(cn="+ searchQuery +"))",
            scope: 'sub',
            attributes: ['sAMAccountName','givenName','sn','mail','thumbnailPhoto','displayname','department','title','manager'],
          }
       
          client.search('OU=SSMP,OU=ON_Users,OU=PHSM01,OU=Asia,dc=ad,dc=onsemi,dc=com', searchOptions, (err, search) => {
            if (err) {
              res.status(500).send("Error:" + err)
            } 
            else {
              search.on('searchEntry', function (entry) {
                res.json({
                  "authorized": true,
                  "status_code": 200,
                  "user_data": entry.object
                })
              });
              search.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join())
              });
              search.on('error', function (err) {
                res.json({
                  "authorized": false,
                  "status_code": 500,
                  "error_message": err
                })
              });
              search.on('end', function (result) {
                console.log('status: ' + result.status)
                client.unbind();
                client.destroy();
              });
            }
          })
        }
      })
    }
    catch (err) {
      return err
    }
  } 
  else {
  }
}