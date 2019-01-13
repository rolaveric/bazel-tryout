# BazelTryout

Repo that steps through the use of Bazel with Angular workspaces, progressively adding and testing different workspace requirements.

# Initial setup

* Install Java/OpenJDK 1.8
* Install Bazel: https://docs.bazel.build/versions/master/install.html
* Install NodeJS: https://nodejs.org
* Install yarn: https://yarnpkg.com
* Install Angular CLI + schematics: `yarn global add @angular/cli @angular/bazel`
* Install ibazel (for watch mode): `yarn global add @bazel/ibazel`

# Single app nx workspace: [ef24ef9](https://github.com/rolaveric/bazel-tryout/commit/ef24ef93b17864701ede59289700c9b5024ceca7)

First step is a single app nx workspace setup to use Bazel for dev, unit testing, and builds.  

The best setup I found is to actually create the workspace using `ng add bazel-tryout --collection=@angular/bazel`,
then manually add the nx extensions to it by:
* Moving the app code to `apps/single-app/`
* Moving the e2e code to `apps/single-app-e2e/`
* Creating an `nx.json` file
* Adding `affected` scripts to `package.json`

Uses
* Dev server: `yarn start single-app` :heavy_check_mark:
* Prod server: `yarn start single-app --prod` :heavy_check_mark:
* Dev build: `yarn run build single-app` :heavy_check_mark:
* Prod build: `yarn run build single-app --prod` :heavy_check_mark:
* Unit tests: `yarn test single-app` :heavy_check_mark:
* E2E tests: `yarn run e2e single-app-e2e` :heavy_check_mark:

# SCSS component styling

TODO

# Sub Bazel package

TODO

# App + Library

TODO

# import @angular/material

TODO

# import @ngrx

TODO

# import lodash

TODO

# Lazy-loaded route chunking

TODO

# Other TODOs

* CI setup (Travis and/or Circle)
* Schematics
* Docker
* Windows
