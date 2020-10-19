# Minesweeper Classic

The original old school minesweeper in React Native

Power on windows 95 / 98, solve the old school puzzle, survive the mines

![demo](./demo/demo.jpg)

Get it on the [Google Play Store](https://play.google.com/store/apps/details?id=com.kima.minesweeper)

## Requirements

- node
- npx
- yarn
- adb

## Install

Install dependencies with:

```
make install
```

## Run

Connect a phone or emulator, then run:

```
make mobile-run
```

## Build Android package

Bundle and build an Android release package with:

```
make android-build
```

## More commands

Execute the commands with `make <command>`:

| command                              | description                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| `install`                            | Install node packages                                             |
| `uninstall`                          | Remove node packages                                              |
| `mobile-run`                         | Run the React Native bundler (equivalent to `react-native start`) |
| `DEVICE=<AVD_NAME> android-emulator` | Start an android emulator                                         |
| `android-avd-list`                   | List available avd's                                              |
| `INSTANT=<0/1> android-build-apk`    | Build Android release APK file                                    |
| `INSTANT=<0/1> android-build`        | Build Android bundle file                                         |
| `android-install-release`            | Install Android release APK on device/emulator                    |
| `android-clean`                      | Clean Android buid related files                                  |
| `VERSION=<VERSION> new-version`      | Create new app version                                            |
