FROM telepathy/frontend.deps:latest AS setup

FROM setup AS files
COPY --chown=app:app . .

FROM files AS dist
RUN dist
