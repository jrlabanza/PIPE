export default async function handler(req, res) {
  if (req.method === 'POST') {
    const ldap = require('ldapjs')
    const {
      username,
      password,
    } = req.body
    try{
      const client = await ldap.createClient({
        url: 'LDAP://ad.onsemi.com',
        paged: {
          pageSize: 250,
          pagePause: true
        },
      })

      client.on('error', (err) => {
        console.log(err)
      })

      client.bind("onsemi\\"+username, password, (err) => {
        if(err){
          client.unbind()
          client.destroy()
          return res.json({
            "status_code": 500,
            "error_message": err
          })
        }
        console.log("Connected to Active Directory Server Successfully")
        client.search(
          'dc=ad,dc=onsemi,dc=com',
          {
            filter: '(sAMAccountName='+ username +')',
            scope: 'sub',
          },
          (err, search) => {
            if (err) {
              return res.status(500).send("Search Error:" + err)
            } 
            search.on('searchEntry', function (entry) {
              return res.json({
                "authorized": true,
                "status_code": 200,
                "user_data": entry.object,
                "token": password
              })
            })
            search.on('searchReference', function (referral) {
              return console.log('referral: ' + referral.uris.join())
            })
            search.on('error', function (err) {
              return res.json({
                "authorized": false,
                "status_code": 500,
                "error_message": err,
                "token":null
              })
            })
            search.on('end', function (result) {
              console.log('status: ' + result.status)
              client.unbind()
              client.destroy()
            })
          }
        )
      })
    }
    catch (err){
      console.log(err)
      return err
    }
  } 
  else {
  }
}