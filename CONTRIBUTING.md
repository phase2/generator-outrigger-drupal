# CONTRIBUTING

## New Feature Ideas

Reach out by creating a new issue to discuss features if your idea might best be
solved in one of the other generator projects, or as part of a different project
in the Outrigger suite.

## Run the Tests

Before submitting a PR, please run the tests in this repository to confirm
nothing has broken.

```bash
docker-compose run --rm cli npm test
```

## Testing Branches without Docker

If you would like to test out changes to generator-outrigger-drupal or one of the above
projects, please take the following steps:

1. `git clone git@github.com:phase2/generator-outrigger-drupal.git`
2. Check out the alternate branch of generator-outrigger-drupal. If testing alternate
branches of one of the other generators, edit the package.json dependency entry
according to the [package.json dependency
documenation](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies).
3. Run `npm link` to use this copy as the global version. (May require `sudo`)

If you would like to take it a step further and develop in the other generators
while testing with `yo outrigger-drupal`, clone those repositories as well and replace the
version installed in `generator-outrigger-drupal/node_modules` with a symlink. **Note this may
not work in npm v3.x.**
