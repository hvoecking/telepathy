COMPONENT=android

include build.Makefile

.PHONY: sdk
sdk: base
	build-docker android sdk

.PHONY: setup
setup: sdk deps

.PHONY: files
files: sdk deps

.PHONY: dist
dist: sdk deps
