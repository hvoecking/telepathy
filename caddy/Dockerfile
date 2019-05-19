
FROM telepathy/base.build:latest AS setup
ENV CADDY_DIST_URL=https://caddyserver.com/download/linux/amd64?plugins=http.cache,http.cors,http.ipfilter&license=personal&telemetry=off
USER root
RUN mkdir -p ~/tmp
RUN wget -qO- ${CADDY_DIST_URL} | tar xz -C ~/tmp/ \
  && mv ~/tmp/caddy /usr/local/bin/ \
  && rm -rf ~/tmp/*
RUN setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/caddy
USER ${user}
COPY --chown=app:app bin/ bin/
ARG ENV_CONTENT=UNSET
ENV \
  CADDYPATH=/data/caddy \
  PATH="${DOCKER_PROJECT_ROOT}/bin/:${PATH}" \
  ENV_CONTENT="${ENV_CONTENT}"
RUN true \
  && mkdir config \
  && cd config \
  && echo "${ENV_CONTENT}" >.env \
  && convert-env bash >profile \
  ;
VOLUME "${DOCKER_PROJECT_ROOT}/config"

FROM setup AS files

FROM files as dist
