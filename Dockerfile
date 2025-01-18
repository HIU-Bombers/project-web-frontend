FROM node:22-bullseye

RUN apt update -qy && \
    apt install -qy \
        xdg-utils \
        usbutils \
        v4l-utils
