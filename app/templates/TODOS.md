# TODOS

* [ ] Review the codebase so you know what you've got:
  * Read the READMEs
  * src/sites/settings.common.php for Docker-savvy Drupal settings
  * Scripts in `bin/`
  * Gruntconfig.json
* [ ] Set up the Docker-based site.
  * Read the [_devtools_vm documentation](https://bitbucket.org/phase2tech/_devtools_vm/src/master/docs/).
  * Run  `docker-compose pull && docker-compose -f build.yml pull` to ensure you have the latest Docker images for local development.
  * Run `bash bin/start.sh` to confirm the code works.
  * `npm install` and other tools should only be run inside containers.
* [ ] Set up Jenkins to manage your CI and build processes.
  * Ensure the Jenkins jobs have the correct Git URL.
  * Visit the CI Server and [spin up your Jenkins instance](http://build.ci.p2devcloud.com/job/ci-start/parambuild/?delay=0sec&NAME=<%= projectName
%>&GIT_URL=git%40bitbucket.org%3Aphase2tech%2F<%= projectName %>.git&GIT_REF=develop).
  * Confirm that you **do not need** a dedicated Dev Cloud instance.
* [ ] Adjust the project to match your project's needs.
  * Do not forget to specify your profile in `Gruntconfig.json`!
  * Remove `--no-db-load` from start.sh if you switch to DB-driven development.
  * Rewrite the READMEs to match your project's details. Pay specific attention to the CONTRIBUTING.md.
* [ ] Commit and push the code to your project repository.
* [ ] Join the **#devtools-support** flow to get help. Ask for one-on-one time for troubleshooting or additional coaching.
