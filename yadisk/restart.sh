#!/bin/bash -e

NAME=cafe-yadisk
CONF_VOL=cafe-yadisk-config:/root/.config/yandex-disk
DATA_VOL=cafe-yadisk-data:/yadisk

docker build -t private/$NAME .

(docker stop $NAME && docker rm $NAME) || true

docker run --rm -ti -v $CONF_VOL private/$NAME /setup.sh

docker run -dti \
    --name=$NAME \
    -v $CONF_VOL \
    -v $DATA_VOL \
    --log-driver=none \
    --restart=unless-stopped \
    private/$NAME /cmd.sh
