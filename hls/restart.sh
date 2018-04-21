#!/bin/bash -e

NAME=cafe-hls

docker build -t private/$NAME .

docker rm -f $NAME || true

docker run -dti \
    --name=$NAME \
    -v cafe-yadisk-data:/opt/yadisk:ro \
    -v /run/cafe-hls:/opt/hls \
    --log-opt max-size=1m \
    --log-opt max-file=2 \
    --restart=unless-stopped \
    private/$NAME
