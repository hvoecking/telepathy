#!make

SHELL = bash

PATH := $(CURDIR)/scripts/bin:$(PATH)

.PHONY: all
all: android #ipfs www

.PHONY: android
android:
	$(MAKE) -f android/build.Makefile setup
	docker-compose run -T android

.PHONY: down
down:
	docker-compose down

.PHONY: up-lint
up-lint:
	$(MAKE) -f lint/build.Makefile setup
	docker-compose up -d lint

.PHONY: files-lint
files-lint:
	(cp -r .git lint/.git; trap "rm -rf lint/.git" EXIT; $(MAKE) -f lint/build.Makefile files)
	docker run telepathy/lint.files lint-commit
	docker run telepathy/lint.files lint-ts
	docker run telepathy/lint.files lint-bash

.PHONY: default files-lint
default:
	$(MAKE) -f frontend/build.Makefile dist
	#docker cp telepathy/frontend.dist
	$(MAKE) -f android/build.Makefile dist

.PHONY: travis
travis: down files-lint build-chrome-debug
	$(MAKE) -f frontend/build.Makefile dist
	docker-compose run -T --service-ports --use-aliases travis

.PHONY: test
test: down files-lint build-chrome-debug
	$(MAKE) -f appium/build.Makefile files
	$(MAKE) -f frontend/build.Makefile dist
	$(MAKE) -f android/build.Makefile dist
	docker-compose run -T --service-ports --use-aliases ci

.PHONY: build-serve
build-serve: down
	$(MAKE) -f ipfs/build.Makefile files
	$(MAKE) -f caddy/build.Makefile files
	$(MAKE) -f frontend/build.Makefile setup

.PHONY: serve
serve: down
	docker-compose up serve

.PHONY: watch
watch: down build-chrome-debug #build-ipfs
	$(MAKE) -f frontend/build.Makefile setup
	docker-compose up watch

.PHONY: build-chrome-debug
build-chrome-debug:
	$(MAKE) -f chrome-debug/build.Makefile setup

.PHONY: build-caddy
build-caddy: build-ipfs
	$(MAKE) -f caddy/build.Makefile files

.PHONY: caddy
caddy:
	docker-compose up caddy

.PHONY: build-ipfs
build-ipfs:
	$(MAKE) -f ipfs/build.Makefile files

.PHONY: ipfs
ipfs:
	docker-compose up ipfs

.PHONY: publish
publish: down
	$(MAKE) -f frontend/build.Makefile dist
	$(MAKE) -f ipfs/build.Makefile dist
	docker-compose run publish

.PHONY: gcp
gcp: down
	$(MAKE) -f frontend/build.Makefile dist
	$(MAKE) -f ipfs/build.Makefile dist
	$(MAKE) -f caddy/build.Makefile dist
	$(MAKE) -f gcp/build.Makefile dist
