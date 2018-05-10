#!/bin/bash
TMPBG=/tmp/screen.png
LOCK=$HOME/lock.png
RES=1366x768

ffmpeg -f x11grab -video_size $RES -y -i $DISPLAY -i $LOCK -filter_complex "gblur=10:2,overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2" -vframes 1 $TMPBG
i3lock -i $TMPBG
sleep 1
xset dpms force off
