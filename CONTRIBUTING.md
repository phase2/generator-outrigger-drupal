# CONTRIBUTING

## Run the Tests

Before submitting a PR, please run the tests in this repository to confirm
nothing has broken.

```bash
npm test
```

or

```bash
docker-compose run --rm cli npm test
```

## Docker-based Development

For development purposes, or sometimes ease of version management, this repo
provides Docker integration. Clone git to the version you want and run from
inside the repo:

```bash
docker-compose run --rm cli npm install
YO_PROJECT_DIRECTORY=path/to/empty/directory docker-compose run --rm p2
```

## Testing Branches without Docker

If you would like to test out changes to generator-p2 or one of the above
projects, please take the following steps:

1. `git clone git@bitbucket.org:phase2tech/generator-p2.git`
2. Check out the alternate branch of generator-p2. If testing alternate
branches of one of the other generators, edit the package.json dependency entry
according to the [package.json dependency
documenation](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies).
3. Run `npm link` to use this copy as the global version. (May require `sudo`)

If you would like to take it a step further and develop in the other generators
while testing with `yo p2`, clone those repositories as well and replace the
version installed in `generator-2/node_modules` with a symlink. **Note this may
not work in npm v3.x.**
