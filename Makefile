#!make

###
# @license
# Heye Vöcking All Rights Reserved.
#
# Use of this source code is governed by an MIT-style license that can be
# found in the LICENSE file at https://telepathy.app/license
##

commitlint:
	docker build \
		-t telepathy/commitlint \
		-f Dockerfile.commitlint \
		-<Dockerfile.commitlint \
	;
	docker run \
		--user $$(id -u):$$(id -g) \
		--rm \
		-v $$PWD/commitlint.config.js:/app/commitlint.config.js \
		-v $$PWD/.git:/app/.git/ telepathy/commitlint:latest \
	;

travis: commitlint
