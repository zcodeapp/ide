FROM cypress/included:12.12.0

RUN chown node:node -R /root/.cache

RUN mkdir -p /var/www \
    && chown node:node /var/www \
    && apt-get update \
    && apt-get install -y x11-utils git curl vim -y \
    && curl -sSL https://get.docker.com/ | sh \
    && usermod -aG docker node \
    && sed -i 's/docker:x:999:node/docker:x:998:node/g' /etc/group \
    && apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf /var/lib/{apt,dpkg,cache,log}/

WORKDIR /e2e

USER node

ENTRYPOINT ["/bin/bash"]
CMD ["-"]