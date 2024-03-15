#!/bin/bash

# note: this will not work if you try to run it on a dev machine
echo "Node version:"
node -v

# get latest version from git
cd /home/adam/aika && git pull &&

# loads dependencies, builds production versions
cd ./backend && bash build_production_apps.sh &&

# reload app in pm2
cd /home/adam && pm2 startOrGracefulReload nt.config.js &&

echo "Successfully deployed latest version!"