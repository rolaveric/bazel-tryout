# BazelTryout

Repo that steps through the use of Bazel with Angular workspaces, progressively adding and testing different workspace requirements.

# Initial setup

* Install Java/OpenJDK 1.8
* Install Bazel: https://docs.bazel.build/versions/master/install.html
* Install NodeJS: https://nodejs.org
* Install yarn: https://yarnpkg.com
* Install Angular CLI + schematics: `yarn global add @angular/cli @angular/bazel`
* Install ibazel (for watch mode): `yarn global add @bazel/ibazel`

# Script targets

These are the different scripts used to test each application, including both bazel scripts and standard Angular CLI scripts.

Bazel targets
* Dev server: `ng serve $APP`
* Prod server: `ng serve $APP --prod`
* Dev build: `ng build $APP`
* Prod build: `ng build $APP --prod`
* Unit tests: `ng test $APP`
* E2E tests: `ng e2e $APP-e2e`

Angular CLI targets:
* Dev server: `ng run $APP:ngserve`
* Prod server: `ng run $APP:ngserve --configuration=production`
* Dev build: `ng run $APP:ngbuild`
* Prod build: `ng run $APP:ngbuild --configuration=production`
* Unit tests: `ng run $APP:ngtest`
* E2E tests: `ng run $APP-e2e:nge2e`

# Single app nx workspace: [ef24ef9](https://github.com/rolaveric/bazel-tryout/commit/ef24ef93b17864701ede59289700c9b5024ceca7)

First step is a single app nx workspace setup to use Bazel for dev, unit testing, and builds.  

The best setup I found is to create the workspace using `ng new bazel-tryout --collection=@angular/bazel`,
then manually add the nx extensions to it by:
* Moving the app code to `apps/single-app/`
* Moving the e2e code to `apps/single-app-e2e/`
* Creating an `nx.json` file
* Adding `affected` scripts to `package.json`

`APP=single-app`

Bazel targets
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

Angular CLI targets:
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

# SCSS component styling

Generated new app using `ng g app scss-component-styling` then applied the Bazel scripts and files from `single-app`.

The key to using SCSS (or any compile-to-CSS language) is to compile each file in it's own bazel rule, then include the output as an asset to the `ng_module()` rule:

```
load("@io_bazel_rules_sass//:defs.bzl", "sass_binary")

sass_binary(
    name = "app_styling",
    src = "src/app/app.component.scss",
)

ng_module(
    name = "scss-component-styling",
    ...
    assets = glob([
      "**/*.css",
      "**/*.html",
    ]) + [":app_styling"],
)
```

`APP=scss-component-styling`

Bazel targets
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

Angular CLI targets: All fail as unable to find `app.component.css`, because it's now `app.component.scss`.
* Dev server :x:
* Prod server :x:
* Dev build :x:
* Prod build :x:
* Unit tests :x:
* E2E tests :x:

## Backwards compatibility workaround

If it's important to you to have backwards compatibility with the standard Angular CLI builders, for either a gradual adoption or as a safety net, you'll need to find a workaround for the CSS processing problem.

One possibility would be to use a separate tool that watches your SCSS files for changes and generates the CSS files in your source code. It means committing generated code, but ideally it should only be for a short transition period. After which it's easier to cleanup the unwanted `*.css` files.

# Sub Bazel package

Generated with `ng g app sub-package`, then generated a `feature-a` module and component.

Created `apps/sub-package/src/app/feature-a/BUILD.bazel` with an `ng_module()` rule for it's contents.  
Then altered `apps/sub-package/BUILD.bazel` to depend on `//apps/sub-package/src/app/feature-a`, and only include specific files so as not to overlap with the new package.

`APP=sub-package`

Bazel targets
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

Angular CLI targets
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

## Schematics opportunity

It wouldn't be too difficult to create a schematic that could generate or update a `BUILD.bazel` file for a folder within an Angular app, generating the correct `deps` lists based on the imports from the `*.ts` code. It could also run against the parent package, as it should now be importing from the newly created package.

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
