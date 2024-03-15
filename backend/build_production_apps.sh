#!/bin/bash

echo "Running production build script"

# browser app
cd ../browserApp && npm ci --include=dev && npm run build &&

# email confirmation mini-app
cd ../browserConf && npm ci --include=dev && npm run build &&

# NT root app
cd ../browserRoot && npm ci --include=dev && npm run build &&

## deployment server
cd ../deploymentServer && npm ci &&

# now backend setup
cd ../backend && npm ci && bash build_temp_media_folder.sh &&

echo "Production builds run successfully!"