#!/bin/sh

try_url() {
    jpeg=`curl -Lfs "$1" | base64`
    if [ -n "$jpeg" ]; then
        echo "Content-Type: image/jpeg"
        echo ""
        echo $jpeg | base64 -d
        exit 0
    fi
}

try_url `curl -Lfs https://www.shazam.com/discovery/v5/-/RU/web/-/track/$SHID | jq -r .images.coverart | sed -r 's/_s[0-9]+/_s0/'`

echo "Status: 500"
echo "Content-Type: text/plain"
echo ""
echo "Failed"
