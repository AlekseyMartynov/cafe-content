#!/bin/bash -e

NAME=cafe-mp3-server

docker build -t private/$NAME .

docker rm -f $NAME || true

docker run -dti \
    --name=$NAME \
    -v cafe-yadisk-data:/yadisk:ro \
    -p 172.17.0.1:9000:9000 \
    --log-driver=none \
    --restart=unless-stopped \
    private/$NAME
