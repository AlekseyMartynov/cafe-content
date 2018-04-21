#!/bin/bash
PID=`pidof cafe-mp3-server`
lsof -w -p $PID
lsof -w -p $PID | wc -l
