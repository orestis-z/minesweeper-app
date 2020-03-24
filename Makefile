SHELL:=/usr/local/bin/bash

NODE_BINARIES_PATH=node_modules/.bin/

ENVS=local local-mobile dev stage prod
DIST_ENVS=stage prod

check-env:
ifndef ENV
	$(error ENV is undefined)
endif
ifeq ($(ENV), local)
	$(eval export NODE_ENV=local)
else ifeq ($(ENV), local-mobile)
	$(eval export NODE_ENV=local-mobile)
else ifeq ($(ENV), dev)
	$(eval export NODE_ENV=development)
else ifeq ($(ENV), stage)
	$(eval export NODE_ENV=production)
else ifeq ($(ENV), prod)
	$(eval export NODE_ENV=production)
else
	$(error ENV should be one of [$(ENVS)] but was "$(ENV)" instead)
endif

check-env-dist:
ifndef ENV
	$(error ENV is undefined)
endif
ifeq ($(ENV), stage)
	$(eval export NODE_ENV=staging)
else ifeq ($(ENV), prod)
	$(eval export NODE_ENV=production)
else
	$(error ENV should be one of [$(DIST_ENVS)] but was "$(ENV)" instead)
endif

check-build:
ifeq (,$(wildcard ./web/build/$(ENV)/))
	$(error build folder ./web/build/$(ENV)/ not found)
endif

get-version:
ifndef VERSION
	$(eval export VERSION=$(shell node -e "console.log(require('./src/config/version.js'))"))
endif

is-web:
	$(eval export PLATFORM=web)

get-region:
ifndef AWS_REGION
	$(eval export AWS_REGION=us-east-1)
endif

confirm:
	@echo "Continue? [y/N]" && read ans && [ $${ans:-N} = y ]

install:
	@yarn

uninstall:
	rm -r node_modules/

#########
## Web ##
#########

.PHONY: web-run
web-run: check-env is-web
	@node --max-old-space-size=8192 $(NODE_BINARIES_PATH)/webpack-dev-server -d --config webpack/config.dev.babel.js --port 8080 --hot --inline

#############
## Mobile ##
############

.PHONY: mobile-run
mobile-run:
	@node node_modules/react-native/local-cli/cli.js start

.PHONY: android-emulator
android-emulator:
ifndef DEVICE
	@$(error DEVICE not defined (run 'make android-avd-list' to get available devices))
endif
	@$(ANDROID_HOME)tools/emulator @$(DEVICE)

.PHONY: android-avd-list
android-avd-list:
	@$(ANDROID_HOME)tools/bin/avdmanager list avd

.PHONY: android-build-apk
android-build-apk:
	npx jetify
ifndef INSTANT
	cd android ; ./gradlew assembleRelease ; cd -
	@tput setaf 6;\
	echo "android/app/build/outputs/apk/release/app-release.apk";\
	tput sgr0
else
	cd android ; ./gradlew assembleReleaseInstant ; cd -
	@tput setaf 6;\
	echo "android/app/build/outputs/apk/releaseInstant/app-releaseInstant.apk";\
	tput sgr0
endif

.PHONY: android-build
android-build:
	npx jetify
ifndef INSTANT
	cd android ; ./gradlew bundleRelease ; cd -
	@tput setaf 6;\
	echo "android/app/build/outputs/bundle/release";\
	tput sgr0
else
	cd android ; ./gradlew bundleReleaseInstant ; cd -
	@tput setaf 6;\
	echo "android/app/build/outputs/bundle/releaseInstant";\
	tput sgr0
endif

.PHONY: android-install-release
android-install-release:
	adb install android/app/build/outputs/apk/release/app-release.apk

.PHONY: android-clean
android-clean:
	cd android ; ./gradlew clean ; cd -

##########
## Misc ##
##########

.PHONY: new-version
new-version:
ifndef VERSION
	$(error VERSION is undefined)
endif
	@node ./scripts/checkVersion.js
	@yarn version --new-version $(VERSION)

.PHONY: compress-TTF
compress-TTF:
ifndef GLYPHS
	$(error GLYPHS is undefined)
endif
ifndef IN
	$(error IN is undefined)
endif
ifndef OUT
	$(error OUT is undefined)
endif
	@node scripts/compressTTF.js $(GLYPHS) $(IN) $(OUT)
