export default function handler(req, res) {
  if (req.method === 'POST') {
    var ldap = require('ldapjs')

    const {
      username,
      password,
    } = req.body
    try {
      var client = ldap.createClient({
        url: 'ldap://ad.onsemi.com',
        reconnect: true
      })

      var searchOptions = {
        filter: "(&(objectClass=user)(objectCategory=person))",
        scope: 'sub',
        //attributes: ['sAMAccountName','givenName','sn','mail','thumbnailPhoto','displayname','department','title','manager'],
        sizeLimit:0
      }
  
      client.bind("onsemi"+"\\"+username, password, function(err){  
        if(err){
          res.json({
            "status_code": 500,
            "error_message": err
          })
        }
        else{
          client.search('OU=SSMP,OU=ON_Users,OU=PHSM01,OU=Asia,dc=ad,dc=onsemi,dc=com', searchOptions, (err, search) => {
          //client.search('dc=ad,dc=onsemi,dc=com', searchOptions, (err,search) => {
            var results = []
            search.on('searchRequest', (searchRequest) => {
              console.log('searchRequest: ', searchRequest.messageID)
            });
            search.on('searchEntry', (entry) => {
              //console.log('entry: ' + JSON.stringify(entry.object));
                // results.push({
                //   "givenName":entry.object.givenName,
                //   "department":entry.object.department,
                //   "mail":entry.object.mail
                //   })
                  results.push(entry.object)
            });
            search.on('searchReference', (referral) => {
              console.log('referral: ' + referral.uris.join());
            });
            search.on('error', (err) => {
              console.error('error: ' + err.message);
            });
            search.on('end', (result) => {
              console.log('status: ' + result.status);
              res.json(results)
            });
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