FROM alpine:3.11

RUN apk add --no-cache curl fcgiwrap jq

ADD index.sh /
RUN chmod +x /index.sh

STOPSIGNAL SIGKILL
CMD [ "fcgiwrap", "-s", "tcp:0.0.0.0:9100" ]
