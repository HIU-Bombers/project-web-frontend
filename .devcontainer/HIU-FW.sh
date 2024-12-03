#!/bin/bash

CRT_FILE="singed_HIU-FW.crt"

if [ ! -f "$CRT_FILE" ]; then
    PREV=$(pwd)

    cd ./.devcontainer

    wget https://itc.do-johodai.ac.jp/wordpress/wp-content/uploads/2024/03/cert_HIU-FW.crt \
        --no-check-certificate
    openssl x509 -in cert_HIU-FW.crt -inform PEM -out $CRT_FILE
    rm cert_HIU-FW.crt

    cd $PREV
fi
