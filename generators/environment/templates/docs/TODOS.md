# TODOS

* [ ] Review the codebase so you know what you've got:
    * Read the READMEs
    * `src/sites/settings.common.php` for Docker-savvy Drupal settings
    * Scripts in `bin/`
    * Gruntconfig.json
    * `env/build/etc/drush/drushrc.php` for drush config and default options you may want to change for the sql-dump command.
* [ ] Set up the Docker-based site.
    * Install and start [Outrigger](http://docs.outrigger.sh/).
    * Run  `docker-compose pull && docker-compose -f build.yml pull` to ensure you have the latest Docker images for local development.
    * Run `rig project sync:start` and `rig project setup` to confirm the code works and setup your project.
    * `npm install` and other tools should only be run inside containers.
* [ ] Set up Jenkins to manage your CI and build processes.
    * Ensure the Jenkins jobs have the correct Git URL.
    * Visit the CI Server and [spin up your Jenkins instance](http://build.<%= host.devcloud %>/job/ci-start/parambuild/?delay=0sec&NAME=<%= projectName %>&GIT_URL=git%40bitbucket.org%3Aphase2tech%2F<%= projectName %>.git&GIT_REF=develop).
    * Confirm that you **do not need** a dedicated Dev Cloud instance.
* [ ] Adjust the project to match your project's needs.
    * Do not forget to specify your profile in `Gruntconfig.json`!
    * Remove `--no-db-load` from start.sh if you switch to DB-driven development.
    * Rewrite the READMEs to match your project's details. Pay specific attention to the CONTRIBUTING.md.
<% if (mail.exists) { %>* [ ] Add the SMTP module to the project to use MailHog for testing
    * Add the module to your makefile.
    * Enable the module and turn on STMP mail transport at `admin/config/system/smtp`.
    * Send a test email using the admin form and confirm mail is routed to the MailHog UI at `mail-<environment-hostname>` for devcloud, or `mail.<%= projectName %>.vm:8025` locally.<% } %>
* [ ] Commit and push the code to your project repository.
* [ ] Join the **#devtools-support** flow to get help. Ask for one-on-one time for troubleshooting or additional coaching.
* [ ] Report on any changes made to get the environment working.
