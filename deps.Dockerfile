ARG NODE_ENV=UNSET

FROM telepathy/base.build:latest AS modules
COPY --chown=app:app \
  package-lock.json \
  package.json \
  ./
RUN \
  [[ ${NODE_ENV} == development ]] || (npm ci && npm cache clean --force)

FROM modules AS modules-production
VOLUME "${DOCKER_PROJECT_ROOT}/node_modules"

FROM modules AS modules-test
VOLUME "${DOCKER_PROJECT_ROOT}/node_modules"

FROM modules AS modules-development
VOLUME "node_modules:${DOCKER_PROJECT_ROOT}/node_modules/"
# Do not protect node_modules in development mode

FROM modules-${NODE_ENV} AS deps
ENV PATH="${DOCKER_PROJECT_ROOT}/node_modules/.bin/:${PATH}"
ENV PATH="${DOCKER_PROJECT_ROOT}/bin/:${PATH}"
COPY --chown=app:app bin/ bin/
ARG ENV_CONTENT=UNSET
ENV ENV_CONTENT="${ENV_CONTENT}"
RUN echo ENV_CONTENT=$ENV_CONTENT
RUN mkdir config \
  && cd config \
  && echo "${ENV_CONTENT}" >.env \
  && convert-env bash >profile \
  && convert-env js >environment.js \
  && convert-env json >environment.json \
  && convert-env model >environment.model.ts \
  && convert-env ts >environment.ts \
  ;
VOLUME "${DOCKER_PROJECT_ROOT}/config"
