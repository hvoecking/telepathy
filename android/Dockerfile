FROM telepathy/base.build:latest AS sdk
ENV ANDROID_HOME="/${home}/android-sdk"
RUN mkdir "${ANDROID_HOME}"
ARG ANDROID_SDK_VERSION="3859397"
ENV ANDROID_SDK_VERSION="${ANDROID_SDK_VERSION}"
ARG ANDROID_BUILD_TOOLS_VERSION="26.0.0"
ENV ANDROID_BUILD_TOOLS_VERSION="${ANDROID_BUILD_TOOLS_VERSION}"
COPY bin/setup-android-sdk .
RUN ./setup-android-sdk

FROM telepathy/android.deps:latest AS setup
ENV ANDROID_HOME="/${home}/android-sdk"
COPY --chown=app:app --from=telepathy/android.sdk "${ANDROID_HOME}" "${ANDROID_HOME}"

FROM setup AS files
COPY --chown=app:app --from=telepathy/frontend.files:latest \
  "${DOCKER_PROJECT_ROOT}" "/input/frontend"

FROM files AS dist
RUN dist
