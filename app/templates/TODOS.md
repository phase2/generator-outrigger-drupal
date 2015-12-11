# TODOS

* [ ] Review the codebase so you know what you've got:
  * Read the READMEs
  * src/sites/settings.common.php for Docker-savvy Drupal settings
  * Scripts in `bin/`
  * Gruntconfig.json
* [ ] `npm install` and other tools should only be run inside containers.
* [ ] Run `bash bin/start.sh` to confirm the code works.
* [ ] Commit and push the code to your project repository.
* [ ] Ensure the Jenkins jobs have the correct Git URL.
* [ ] Read the [_devtools_vm documentation](https://bitbucket.org/phase2tech/_devtools_vm/src/master/docs/).
* [ ] Visit the CI Server and [spin up your Jenkins instance](http://build.ci.p2devcloud.com/job/ci-start/parambuild/?delay=0sec&NAME=<%= projectName %>&GIT_URL=git%40bitbucket.org%3Aphase2tech%2F<%= projectName %>.git&GIT_REF=develop).
* [ ] Confirm that you **do not need** a dedicated Dev Cloud instance.
* [ ] Join the **#devtools-support** flow to get help.
* [ ] Start building out your custom Install Profile.
  * Do not forget to specify your profile in `Gruntconfig.json`!
