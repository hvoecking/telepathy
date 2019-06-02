# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/hvoecking/telepathy/compare/v0.1.0...v0.2.0) (2019-06-02)


### Bug Fixes

* **gcp:** add missing license header to Dockerfile ([cd6e6ee](https://github.com/hvoecking/telepathy/commit/cd6e6ee))
* **gcp:** remove unnecessary caddy argument '-root' ([027e002](https://github.com/hvoecking/telepathy/commit/027e002))
* **gcp:** use fixed ubuntu version ([4c3c670](https://github.com/hvoecking/telepathy/commit/4c3c670))


### Build System

* **deploy:** use '-i' flag ([e0aa65d](https://github.com/hvoecking/telepathy/commit/e0aa65d))
* **deploy:** use version type to select ipns key ([9ea4e00](https://github.com/hvoecking/telepathy/commit/9ea4e00))
* **gcp:** install caddy from docker image ([b371064](https://github.com/hvoecking/telepathy/commit/b371064))
* **gcp:** wait for api to become available after reset ([ccf4608](https://github.com/hvoecking/telepathy/commit/ccf4608))
* **makefile:** integrate 'deploy' into 'gcp' target ([8b4c91a](https://github.com/hvoecking/telepathy/commit/8b4c91a))
* add release script ([22f175c](https://github.com/hvoecking/telepathy/commit/22f175c))
* deploy site to ipfs ([5eab056](https://github.com/hvoecking/telepathy/commit/5eab056))
* make dockerignore paths more specific ([4f52fe1](https://github.com/hvoecking/telepathy/commit/4f52fe1))
* **travis:** deploy only tags ([dbf5e3f](https://github.com/hvoecking/telepathy/commit/dbf5e3f))


### Features

* inject version into index.html ([ed9d5df](https://github.com/hvoecking/telepathy/commit/ed9d5df))
* **deploy:** check index.html after publishing ([8e3b1a7](https://github.com/hvoecking/telepathy/commit/8e3b1a7))
* **deploy:** use dnsaddr to connect to remote ipfs peer ([4c825c2](https://github.com/hvoecking/telepathy/commit/4c825c2))
* **deploy:** wait for 'ready' messages of daemon ([8565726](https://github.com/hvoecking/telepathy/commit/8565726))
* **gcp:** use gcsfuse to mount 'acme' bucket ([7991781](https://github.com/hvoecking/telepathy/commit/7991781))



## 0.1.0 (2019-05-27)


### Bug Fixes

* **makefile:** add .PHONY to phony targets ([bb9a328](https://github.com/hvoecking/telepathy/commit/bb9a328))
* **makefile:** add magic line ([db8f250](https://github.com/hvoecking/telepathy/commit/db8f250))


### Build System

* add deploy workflow to Google Cloud Platform ([c594ee8](https://github.com/hvoecking/telepathy/commit/c594ee8))
* **ci:** add CI integration with Travis ([7676959](https://github.com/hvoecking/telepathy/commit/7676959))


### Features

* add static 'telepathy.app' site ([b875010](https://github.com/hvoecking/telepathy/commit/b875010))



<a name="0.0.0"></a>
# 0.0.0 (2018-12-08)
