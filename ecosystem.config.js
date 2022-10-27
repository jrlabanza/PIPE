module.exports = {
  apps: [{
    name: 'pipe',
    script: './node_modules/next/dist/bin/next',
    args: 'start -p 3115',
    exec_mode: 'cluster',
  }],
};