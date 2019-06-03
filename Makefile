#!make

###
# @license
# Heye Vöcking All Rights Reserved.
#
# Use of this source code is governed by an MIT-style license that can be
# found in the LICENSE file at https://telepathy.app/license
##

.PHONY: build
build:
	SEMVER=$$(jq -r .version package.json); \
	DATE=$$(date -u +%Y%m%dT%H%M%S); \
	REV=$$(git rev-parse --short HEAD); \
	docker build \
		--build-arg VERSION="v$$SEMVER~$$DATE.git$$REV" \
		--file Dockerfile.build \
		--tag telepathy/build \
		. \
	;

.PHONY: commitlint
commitlint:
	docker build \
		--file Dockerfile.commitlint \
		--tag telepathy/commitlint \
		-<Dockerfile.commitlint \
	;
	docker run \
		--name telepathy-commitlint \
		--rm \
		--user $$(id -u):$$(id -g) \
		--volume $$PWD/.git:/app/.git/ \
		--volume $$PWD/commitlint.config.js:/app/commitlint.config.js \
		telepathy/commitlint:latest \
	;

.PHONY: deploy
deploy: build
	docker build \
		--file Dockerfile.deploy \
		--tag telepathy/deploy \
		. \
	;
	docker run \
		--env IPFS_API_PASSWORD=$$IPFS_API_PASSWORD \
		--env IPFS_API_USERNAME=$$IPFS_API_USERNAME \
		--name telepathy-deploy \
		--rm \
		--user $$(id -u):$$(id -g) \
		-i \
		telepathy/deploy:latest \
	;

.PHONY: gcp
gcp:
	docker build \
		--file Dockerfile.gcp \
		--tag gcr.io/telepathy/gcp \
		. \
	;
	docker push gcr.io/telepathy/gcp:latest
	gcloud compute instances reset telepathy
	while ! curl https://api.telepathy.app >/dev/null; do sleep 1; done

.PHONY: travis
travis: commitlint
