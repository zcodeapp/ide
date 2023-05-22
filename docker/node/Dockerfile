FROM node:20.1.0-alpine3.17

USER root

RUN mkdir -p /var/www \
    && apk add --no-cache git curl \
    && npm install -g npm


WORKDIR /var/www

USER node

ENTRYPOINT ["/bin/sh"]
CMD ["-"]