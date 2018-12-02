ifndef COMPONENT
$(error COMPONENT is not set)
endif

.PHONY: deps
deps: base
	build-docker $(COMPONENT) deps -f deps.Dockerfile

.PHONY: base
base:
	build-docker base build

.PHONY: setup
setup: deps
	build-docker $(COMPONENT) setup

.PHONY: files
files: deps
	build-docker $(COMPONENT) files

.PHONY: dist
dist: deps
	build-docker $(COMPONENT) dist
