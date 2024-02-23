#!/bin/bash

echo "Running production build script"

# browser app
cd ../browserApp && npm ci && npm run build &&

# email confirmation mini-app
cd ../browserConf && npm ci && npm run build &&

# now backend setup
cd ../backend && npm ci && bash build_temp_media_folder.sh &&

echo "Production builds run successfully!"