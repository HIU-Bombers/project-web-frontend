FROM node:21-bullseye

COPY --from=ubuntu:24.04 /root/.bashrc /root/.bashrc

RUN apt update -qy && \
    apt install -qy \
        ca-certificates \
        openssl

# 情報大Wi-Fiの証明書インポート
COPY singed_HIU-FW.crt /usr/local/share/ca-certificates/HIU-FW.crt
RUN update-ca-certificates

WORKDIR /tmp

RUN git clone https://github.com/devcontainers/features.git

RUN bash features/src/docker-outside-of-docker/install.sh
