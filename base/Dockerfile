ARG NODE_ENV=UNSET

FROM node:10.15.0-stretch AS env
ARG NODE_ENV=UNSET
ARG HOST_UID=UNSET
ARG HOST_GID=UNSET
RUN cp $(which bash) $(which sh)
ENV \
  SUDOERS_FILE=/etc/sudoers.d/90-allow-all-sudo \
  NODE_ENV="${NODE_ENV}" \
  group="app" \
  user="app" \
  uid="${HOST_UID}" \
  gid="${HOST_GID}"
ENV \
  uidspec="${uid}:{gid}" \
  userspec="${user}:${group}" \
  home=/home/${user}
ENV DOCKER_PROJECT_ROOT=${home}/telepathy
ENV PATH="${home}/bin:${PATH}"
WORKDIR ${DOCKER_PROJECT_ROOT}

FROM env as apt-production
RUN apt-get -qqy update
RUN apt-get -qqy --no-install-recommends install \
  libcap2-bin \
  moreutils \
  sudo \
  && apt-get autoremove -y

FROM apt-production as apt-development
RUN apt-get -qqy --no-install-recommends install \
  build-essential \
  ca-certificates \
  curl \
  fonts-liberation \
  gconf-service \
  git \
  gradle \
  htop \
  inotify-tools \
  jq \
  less \
  libappindicator1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  net-tools \
  netcat \
  openjdk-8-jdk \
  openjdk-8-jre \
  pv \
  shellcheck \
  silversearcher-ag \
  unzip \
  vim \
  wget \
  xdg-utils \
  && apt-get autoremove -y \
  ;

FROM apt-development AS apt-test

FROM apt-${NODE_ENV} AS user
RUN userdel -r node \
  && (getent group ${gid} > /dev/null || groupadd -g ${gid} ${group}) \
  && useradd -u ${uid} -g ${gid} ${user} -c ${user} --create-home --shell /bin/false \
  && chown -R ${userspec} ${home} \
  && mkdir -p $(dirname "${SUDOERS_FILE}") \
  && echo "${user} ALL=(ALL) NOPASSWD: ALL" >"${SUDOERS_FILE}" \
  && chmod 0440 "${SUDOERS_FILE}" \
  && mkdir /input /output \
  && chown "${userspec}" /output \
  ;
USER ${user}

FROM user AS build
COPY --chown=app:app \
  package-lock.json \
  package.json \
  "${home}/base/"
COPY --chown=app:app bin "${home}/base/bin"
RUN cd "${home}/base/" \
  && npm ci \
  && npm cache clean --force \
  ;
ENV PATH="${home}/base/bin/:${PATH}"
ENV PATH="${home}/base/node_modules/.bin/:${PATH}"
# $ docker-bash base/build -v ~/.npm:/home/app/.npm/ --net=npm_cache_net --expose=8080 --name npm-cache
# app@c3f479370ab0:~/telepathy$ tar cfp - ../.npm | nc -q 0 -v 192.168.160.2 8080
# RUN \
#  (ip add; cd ${HOME}; nc -vl -kp 8080 | tar xvfp - | pv -l -s 37367 | wc -l)
ENTRYPOINT ["bash", "-euc", "entrypoint-base \"${@}\"", "-"]
