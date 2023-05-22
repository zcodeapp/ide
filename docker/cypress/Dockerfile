FROM cypress/included:12.12.0

RUN chown node:node -R /root/.cache

RUN mkdir -p /var/www \
    && chown node:node /var/www \
    && apt-get update \
    && apt-get install -y x11-utils

WORKDIR /e2e

USER node

ENTRYPOINT ["/bin/bash"]
CMD ["-"]