#!/bin/bash -e

EXCLUDE_DIRS=$(cat /root/.config/yandex-disk/exclude-dirs.txt)
exec yandex-disk --no-daemon --overwrite --read-only -d /yadisk --exclude-dirs="$EXCLUDE_DIRS"
