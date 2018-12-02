FROM telepathy/lint.deps:latest AS setup
RUN git config --global user.email "linter@lint"
RUN git config --global user.name "The Linter"
ENTRYPOINT ["/bin/bash", "-euc", "entrypoint-lint \"${@}\"", "-"]

FROM setup AS files
COPY --chown=app:app . .

FROM files AS dist
RUN dist
