# install app 

yarn install

# needed prerequisites
.env.local
.env.development.local

# how to run dev mode
yarn dev

# how to build
yarn build

# PM2 Configuration
# pm2 setup

pm2 start ecosystem.config.js && pm2 save

