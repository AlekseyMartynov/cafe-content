FROM alpine:3.11

RUN apk add --no-cache nodejs ffmpeg

WORKDIR /opt
ADD opt .
RUN chmod +x *.sh

STOPSIGNAL SIGKILL
CMD [ "/opt/cmd.sh" ]
