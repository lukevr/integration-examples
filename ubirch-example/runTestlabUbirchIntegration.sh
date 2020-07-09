#!/bin/sh
export MONGODB_URI="mongodb://127.0.0.1:27017/testlab"
pm2 stop testlab-ubirth-intergation
pm2 start --log ~/logs/testlab-ubirch-integration.log --name testlab-ubirch-integration dist/index.js
