#!/bin/bash

# Read vars from .env
set -o allexport
source .env
set +o allexport

mkdir -p ssh

# Generate key if not present
if [ ! -f ssh/afip.key ]; then
  openssl genrsa -out ssh/afip.key 2048
fi

# generate cert
SUBJECT="/C=AR/O=$NOMBRE/CN=$NOMBRE/serialNumber=CUIT $CUIT"
openssl req -new -key ssh/afip.key -subj "$SUBJECT" -out ssh/afip.csr
