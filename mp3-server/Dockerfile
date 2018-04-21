FROM golang:1-alpine3.7 as builder
RUN apk add --no-cache git
WORKDIR /go/src/cafe-mp3-server
RUN go get gopkg.in/gorilla/mux.v1
ADD *.go ./
RUN go build

FROM alpine:3.7
WORKDIR /
COPY --from=builder /go/src/cafe-mp3-server/cafe-mp3-server .
ENTRYPOINT [ "/cafe-mp3-server" ]
