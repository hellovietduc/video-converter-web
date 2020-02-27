#!/usr/bin/env bash

echo "Step 1/2: Build Docker image"
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "version: $PACKAGE_VERSION"
docker build -t vietduc01100001/video-converter-api:$PACKAGE_VERSION .
docker tag vietduc01100001/video-converter-api:$PACKAGE_VERSION vietduc01100001/video-converter-api:latest

echo "Step 2/2: Push to Docker Hub"
docker push vietduc01100001/video-converter-api:$PACKAGE_VERSION
docker push vietduc01100001/video-converter-api:latest

echo "Done!"
