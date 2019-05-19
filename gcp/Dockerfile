FROM telepathy/base.build:latest AS setup
ARG ENV_CONTENT=UNSET
ENV \
  PATH="${DOCKER_PROJECT_ROOT}/bin/:${PATH}" \
  ENV_CONTENT="${ENV_CONTENT}" \
  IPFS_PATH=/data/ipfs \
  CADDYPATH=/data/caddy
RUN true \
  && mkdir config \
  && cd config \
  && echo "${ENV_CONTENT}" >.env \
  && convert-env bash >profile \
  ;

FROM setup AS files
# gcp bin
COPY --chown=app:app bin/ bin/
# caddy
COPY --from=telepathy/caddy.dist:latest /usr/local/bin/caddy /usr/local/bin/caddy
RUN sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/caddy
COPY --chown=app:app --from=telepathy/caddy.dist:latest "${DOCKER_PROJECT_ROOT}/bin/" caddy-scripts/
# ipfs
COPY --from=telepathy/ipfs.dist:latest /usr/local/bin/ipfs /usr/local/bin/ipfs
COPY --chown=app:app --from=telepathy/ipfs.dist:latest "${DOCKER_PROJECT_ROOT}/bin/" ipfs-scripts/
# frontend
COPY --chown=app:app --from=telepathy/frontend.dist:latest /output /input

FROM files as dist
RUN set +x
CMD ["serve"]
