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

App was created called `app-and-library`, and a library was created called `feature-b` based on the nx schematics.

For the most part this is the same process as for the sub-package example, with the exception that the import for the
feature module is an absolute path rather than a relative path.  
Bazel overrides the `paths` setting from tsconfig to work with it's internals. But what it does provide is path from the location of the `WORKSPACE`, using it's name. In this case that's `bazel_tryout/`.  
So instead of `@namespace/feature-b` that might be used in a standard nx workspace, we use `bazel_tryout/libs/feature-b/src`.  
And so our typescript tools don't complain, we add our own `paths` entry to the root `tsconfig.json`:

```
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

# import @ngrx

This was a weird and wonderful one, which I couldn't have worked out without the [angular-bazel-example](https://github.com/angular/angular-bazel-example) repo.

The challenge with this example is that we're importing third-party Angular code without a Bazel package (@ngrx is built with Bazel, but after my experience with Material, I didn't want to even attempt it) and that has... issues.  
The workaround is to run the Angular compiler over the module, generating the necessary files for Bazel to pickup. We do this by introducing a new `postinstall.tsconfig.json` which includes from the important `node_modules/{library}`, and adding a `postinstall` script to `package.json` that runs the Angular compiler (`ngc`) using this tsconfig.

It sounds like the long-term solution is for Ivy to be released, which drops the need for these extra files.  
[It's close, but not there yet.](https://is-angular-ivy-ready.firebaseapp.com/)

The other thing that's required is to provide a config for [RequireJS](https://requirejs.org/) in the devserver, so it knows how to load `@ngrx/store` in AMD or UMD format.

`APP=ngrx-store`

Bazel targets
* Dev server :heavy_check_mark:
* Prod server :x: Some how the `__extends` utility for creating classes comes out `undefined`? Not sure if a rollup or prodserver config problem.
* Dev build :warning: It completes, but the prod server issue makes it suspect.
* Prod build :warning: As above.
* Unit tests :x: Throws error about `'There is no timestamp for @ngrx/store.js!'`. Might need to do some RequireJS config here too?
* E2E tests :heavy_check_mark:

Angular CLI targets
* Dev server :heavy_check_mark:
* Prod server :heavy_check_mark:
* Dev build :heavy_check_mark:
* Prod build :heavy_check_mark:
* Unit tests :heavy_check_mark:
* E2E tests :heavy_check_mark:

# import lodash

TODO

# Lazy-loaded route chunking

TODO

# Other TODOs

* CI setup (Travis and/or Circle)
* Schematics
* Docker
* Windows
