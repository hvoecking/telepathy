COMPONENT=appium

include build.Makefile

base:
	true

deps:
	true

.PHONY: android-dist
android-dist:
	$(MAKE) -f android/build.Makefile dist

.PHONY: files
files: android-dist

.PHONY: dist
dist:
	false
