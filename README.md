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

```python
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

Latest `@angular/bazel` schematics now show it's possible to dynamically create rules using globs and then insert them into `assets`:

```python
[
    sass_binary(
        name = "style_" + x,
        src = x,
        deps = [],
    )
    for x in glob(["src/app/*.scss"])
]

ng_module(
    name = "scss-component-styling",
    assets = glob([
        "**/*.css",
        "**/*.html",
    ]) + [":style_" + x for x in glob(["src/app/*.scss"])],
    ...
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

Angular CLI targets: ~~All fail because unable to find `app.component.css`.~~ Now passes! Thanks to [a change](https://github.com/angular/angular/pull/28167) to the Angular compiler.
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

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

App was created called `app-and-library`, and a library was created called `feature-b` based on the nx schematics.

For the most part this is the same process as for the sub-package example, with the exception that the import for the
feature module is an absolute path rather than a relative path.  
Bazel overrides the `paths` setting from tsconfig to work with it's internals. But what it does provide is path from the location of the `WORKSPACE`, using it's name. In this case that's `bazel_tryout/`.  
So instead of `@namespace/feature-b` that might be used in a standard nx workspace, we use `bazel_tryout/libs/feature-b/src`.  
And so our typescript tools don't complain, we add our own `paths` entry to the root `tsconfig.json`:

```json
{
    "compilerOptions": {
        "paths": {
            "bazel_tryout/*": ["*"]
        }
    }
}
```

`APP=app-and-library`

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

`APP=feature-b`

Bazel targets
* Unit tests :heavy_check_mark:

Angular CLI targets
* Unit tests :heavy_check_mark:

# import @angular/material

:x: Unable to complete  
Trying to run Bazel commands with @angular/material produces an error:

`Error: Expected build_bazel_rules_typescript to be version 0.22.0`

There's some mention of this problem in github.com/angular/angular-bazel-example:
https://github.com/angular/angular-bazel-example/blob/master/WORKSPACE#L43  
However trying to apply the same solution didn't work either. I suspect because other
versions have progressed, causing the same problem to manifest elsewhere.  
I could possibly get it to work by using the exact same `http_archive()` calls from that file.

TODO Revisit

# import @ngrx

@ngrx is a Bazel package, so using it is as simple as adding it to the WORKSPACE via `http_archive`, then referencing it in `BUILD.bazel` as `@ngrx//modules/store`

`APP=ngrx-store`

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

# import lodash (and lodash-es)

This example "works", but it's not an ideal setup.  
The problem is that we have two different Bazel rules that expect the code in two very different formats:

* `ts_devserver` uses RequireJS and expects everything in AMD/UMD format.
* `rollup_bundle` requires everything to be in ESM format, as that's how Rollup functions.

Plain vanilla lodash does have an AMD/UMD bundle, but no ESM artifacts.  
There's an alternative ESM buid called `lodash-es`, but it has no AMD/UMD bundle.

My solution was to use `lodash-es` normally, then set RequireJS config to switch to the lodash bundle during dev.  
This is a flagrant duct-tape-and-string hack though which wouldn't work for every third-party library - and honestly shouldn't.

Similarly for unit tests it kept trying to load `lodash-es.js`, so I created `require.karma-config.js` that maps `lodash-es` to `/base/npm/node_modules/lodash/lodash` (The `/base` part was the real kicker that took me a while to get right).

Possible solution I want to explore include:
* Configuring `rollup_bundle` to use `rollup-plugin-commonjs`, removing the hard reqirement for ESM.
* Using `rollup_bundle` to generate a UMD bundle from ESM based third-party libraries.
* Using `allowJs: true` with typescript to treat third-party code the same as your own code, build wise.

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

TODO Revisit for more elegant solution

# Lazy-loaded route chunking

TODO

# ngx-bootstrap

TODO

# NxModule

TODO

# proxy-config

TODO

# Random issues found

* Sometimes a `bazel clean` is required. eg. I had issues supporting async/await in E2E tests. I had updated `BUILD.bazel` to include `@npm//tslib` but was still getting an error saying it couldn't be found. Running `bazel clean` fixed it. Was infuriating.

# Other TODOs

* CI setup (Travis and/or Circle)
* Schematics
* Docker
* Windows
