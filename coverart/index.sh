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

try_url `curl -Lfs https://www.shazam.com/discovery/v5/-/RU/web/-/track/$SHID | jq -r .images.coverarthq | sed -r 's/[0-9]{3}x[0-9]{3}cc/600x600cc-95/'`

echo "Status: 500"
echo "Content-Type: text/plain"
echo ""
echo "Failed"
