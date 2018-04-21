#!/bin/sh

start_cue_worker() {
    pkill -f cue-worker.sh
    node update-cue-worker "$1" "$2"
    sh cue-worker.sh &
}

send_mpeg() {
    ffmpeg -loglevel warning -ss "$2" -i "$1" -vn -c copy -id3v2_version 0 -write_xing 0 -f mp3 pipe:1
    echo "Sent $1" >&2
}

while true; do
    node update-list
    . ./list.sh
done
