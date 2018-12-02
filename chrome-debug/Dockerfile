FROM selenium/node-chrome-debug:3.141.59-antimony AS setup
USER root
RUN apt-get update
RUN apt-get install -qqy socat
USER seluser
ENTRYPOINT ["bash", "-euc", "socat TCP-LISTEN:${ENV_FRONTEND_PORT},fork TCP:${ENV_FRONTEND_HOST}:${ENV_FRONTEND_PORT} & /opt/bin/entry_point.sh", "-"]
