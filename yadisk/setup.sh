#!/bin/bash -e

if [ ! -f /root/.config/yandex-disk/passwd ]; then
    read -p "User: " user
    yandex-disk token $user
fi

if [ ! -f /root/.config/yandex-disk/exclude-dirs.txt ]; then
    echo "ABORT: Create exclude-dirs.txt"
    exit 1
fi
