#!/bin/bash -e

NAME=cafe-coverart

docker build -t private/$NAME .
docker rm -f $NAME || true

docker run -dti \
    --name=$NAME \
    -p 172.17.0.1:9100:9100 \
    --log-driver=none \
    --restart=unless-stopped \
    private/$NAME
