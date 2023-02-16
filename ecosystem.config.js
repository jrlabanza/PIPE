module.exports = {
  apps: [
    {
      name: 'ePIP',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3115',
      exec_mode: 'cluster',
    },
    {
      name: 'ePIP Download Server',
      script: 'downloadserver.js'
    } 
  ],
};