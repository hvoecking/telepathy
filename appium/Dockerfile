FROM butomo1989/docker-android-x86-8.1 AS setup
RUN mkdir /input

FROM setup AS files
COPY --from=telepathy/android.dist:latest /output/app.apk /input/
