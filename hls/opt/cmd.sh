#!/bin/sh

rm -f hls/*.ts hls/*.tmp
rm -f timebase.txt

./concat-loop.sh | ffmpeg -loglevel warning -re -f mp3 -i pipe:0 -c copy -f hls \
    -hls_flags delete_segments+temp_file+discont_start \
    -hls_start_number_source epoch \
    -metadata service_provider="fmcafe.online" \
    -metadata service_name="fmcafe" \
    hls/stream.m3u8
