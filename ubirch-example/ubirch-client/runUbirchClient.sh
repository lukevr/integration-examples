#!/bin/sh
#UBIRCH_DEVICES=${UBIRCH_UUID}
#UBIRCH_SECRET=${UBIRCH_SECRET}
UBIRCH_ENV=demo
UBIRCH_DEBUG=true
#docker pull ubirch/ubirch-client:stable
docker run -v $(pwd):/data -p 8080:8080 ubirch/ubirch-client:stable
