#!/usr/bin/env bash

echo "Step 1/4: Clean dist directory"
rm -rf dist/*

echo "Step 2/4: Build dist directory"
cp src/index.html dist/
sed -i "s|/app.js|/video-converter/app.js|g" dist/index.html
npx webpack --config webpack.config.js

echo "Step 3/4: Build Docker image"
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "version: $PACKAGE_VERSION"
docker build -t vietduc01100001/video-converter-web:$PACKAGE_VERSION .
docker tag vietduc01100001/video-converter-web:$PACKAGE_VERSION vietduc01100001/video-converter-web:latest

echo "Step 4/4: Push to Docker Hub"
docker push vietduc01100001/video-converter-web:$PACKAGE_VERSION
docker push vietduc01100001/video-converter-web:latest

echo "Done!"
