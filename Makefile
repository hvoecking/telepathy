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

.PHONY: travis
travis: commitlint
