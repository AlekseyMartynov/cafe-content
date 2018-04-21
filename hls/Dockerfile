FROM alpine:3.7

RUN apk add --no-cache nodejs ffmpeg

WORKDIR /opt
ADD opt .
RUN chmod +x *.sh

STOPSIGNAL SIGKILL
CMD [ "/opt/cmd.sh" ]
