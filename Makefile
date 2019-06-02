#!make

###
# @license
# Heye Vöcking All Rights Reserved.
#
# Use of this source code is governed by an MIT-style license that can be
# found in the LICENSE file at https://telepathy.app/license
##

.PHONY: commitlint
commitlint:
	docker build \
		--file Dockerfile.commitlint \
		--tag telepathy/commitlint \
		-<Dockerfile.commitlint \
	;
	docker run \
		--rm \
		--user $$(id -u):$$(id -g) \
		--volume $$PWD/.git:/app/.git/ \
		--volume $$PWD/commitlint.config.js:/app/commitlint.config.js \
		telepathy/commitlint:latest \
	;

.PHONY: gcp
gcp:
	docker build \
		--file Dockerfile.gcp \
		--tag gcr.io/telepathy/gcp \
		. \
	;
	docker push gcr.io/telepathy/gcp:latest
	./scripts/gcloud compute instances reset telepathy

.PHONY: deploy
deploy:
	true \
  && SEMVER=$$(jq -r .version package.json) \
  && DATE=$$(date -u +%Y%m%dT%H%M%S) \
  && REV=$$(git rev-parse --short HEAD) \
  && VERSION="v$$SEMVER~$$DATE.git$$REV" \
	&& echo VERSION: $$VERSION \
	&& docker build \
		--build-arg VERSION=$$VERSION \
		--file Dockerfile.deploy \
		--tag telepathy/deploy \
		. \
	;
	docker run \
		--env IPFS_API_PASSWORD=$$IPFS_API_PASSWORD \
		--env IPFS_API_USERNAME=$$IPFS_API_USERNAME \
		--rm \
		--user $$(id -u):$$(id -g) \
		-i \
		telepathy/deploy:latest \
	;

.PHONY: travis
travis: commitlint deploy
