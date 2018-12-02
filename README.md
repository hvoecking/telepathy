<h1 align="center">
  <br>
  <a href="https://telepathy.app"><img src="https://raw.githubusercontent.com/hvoecking/telepathy/master/frontend/resources/splash.png" alt="Telepahty" width="200"></a>-->
  <br>
  Telepathy
  <br>
  <br>
</h1>

<h4 align="center">Transfer data 'telepathically' between devices.</h4>

<br>

This is a work in progress, as of now (v0.1.0) only the project structure and CI are setup.

# Features
## App
* Fully Decentralized - also known as DApp (soon)
* Integrated with [Blockstack](https://blockstack.org/) - you are in full control of your data (soon)
* Data is shared using [WebTorrent](https://webtorrent.io/) - no downscaling of images and videos, all filetypes are allowed (soon)
* Available on the Web, as Android and iOS app (soon)

## Code Base
* Completely dockerized, no required dependency besides docker
* Using [standard-version](https://github.com/conventional-changelog/standard-version) for bumping semver based on commit message types
* Written in ionic 4 (with angular), based on rxjs with ngrx-data as store (soon)
* Using OrbitDB, ipfs and WebTorrent for data transfer (soon)

# Intention
This project currently serves mostly as a playground for me trying out cutting edge technologies.

# Setup

Required:
* docker >=v18

Recommended:
* smartcd
* make

If you have not installed [smartcd](https://github.com/cxreg/smartcd) export the variables declared in [`scripts/smartcd.enter`](/scripts/smartcd.enter) with the aprropriate values.
Otherwise just add the following line when running `smartcd edeit enter`:
```
source scripts/enter.smartcd
```

If you have not installed `make`, check the [Makefile](/Makefile) how to build and run the following targets.
Ohterwise just do as shown below:

To run the CI:
```
make ci
```

To build run:
```
make (soon)
```

# Concepts

## Structure
The project consists of several dockerized components, namely:
* [android](/android)
* [frontend](/frontend)
* [lint](/lint)
* [ipfs](/ipfs)

## Docker
The project consists of several components, each component is located in the [project root](/) and has a structure with at least these files and folders:
```
<component>
├── bin
├── build.Makefile
├── docker-compose.build.yml
├── Dockerfile
├── package.json
└── package-lock.json
```

The [base](/base) directory is special, it is not a component, but is meant for building the telepathy/base.build image, every component is based on this image, it sets up the user, installs packages, and sets up the `ENTRYPOINT`.
Every component depends on an image built by the `deps.Dockerfile` in each components directory, it installs node modules and injects the configuration.

An image for a component should be built using the `build.Makefile` in its respective directory, it takes care of building the required images the component is based on.

Each component should have at least these scripts in the package.json:
* `dist` - compiles all files and puts the result in `/output`

Each component should have these targets:
* `setup` - component scripts can be run with mounting the <component> directory into the container (usually used for development)
* `files` - component scripts can be run without mounting the <component> directory as the files have been copied into the container (usually used for testing when mounting the components folder is not possible eg. in Travis CI)
* `dist` - components `dist` script (located in it's `package.json` file) has been executed and the data is available at `/output`

Some components expect data in the `/input` directory this should be copied in the Dockerfile or mounted.
