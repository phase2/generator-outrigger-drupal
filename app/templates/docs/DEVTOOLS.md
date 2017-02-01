# DevTools and Docker

> Set up and work with your project via DevTools, our local Docker implementation.

Running this project on Docker streamlines the installation steps.
The Docker configuration in this repository handles all necessary environment
setup for local development or testing environments.

Local environments assume the use of Phase2's "DevTools" utility to manage the
filesystem, DNS, and any necessary virtualization. Read more about this in the
[Phase2 DevTools documentation](http://phase2.github.io/devtools/). (Linux users
should follow the [Linux instructions](http://phase2.github.io/devtools/getting-started/linux-installation/)
for simple things like DNS consistency with macOS users.)

## First-time Application Setup

Once you have a working DevTools + Docker environment, you can have a
locally-hosted, web-browsable site instance in just a few minutes with two
commands.

```bash
git clone <%= gitRepoUrl %>
bin/start.sh
```

This command has a number of options, run `bin/start.sh --help` to see available options. It is also used in our Continuous Integration and QA deployment processes.

> **WARNING**
>
> `start.sh` is a great shortcut to get your development environment started up later, but please review the code to ensure familiarity with everything it does.
> * By default it will reinstall the site, wiping your database.
> * You can run with `--update` for an update operation, though early in the project this will likely fail.

## Daily Routine

* `devtools start`
* eval "$(devtools config)"
* `cd path/to/project`
* `docker-compose up -d`
* [PRODUCTIVE!]
* `devtools stop`

You can leave devtools running day to day, but performance of the environment tends to degrade, so a clean stop, or morning `devtools restart` will help.

## Running Commands in the Build Container

All command-line operations to interact with the application are executed via a dedicated build container that has many tools built-in.

* **Run Drush Command**: `docker-compose -f build.yml run drush <command>`
* **Run Grunt Task**: `docker-compose -f build.yml run grunt <task>`
* **Run Drupal Console Command**: `docker-compose -f build.yml run drupal <command>`
* **Start an interactive BASH session**: `docker-compose -f build.yml run cli`
  * There is no webserver running in this container, so testing operations will require the web container to be active.
  * Run Drush commands with the alias `@<%- projectName %>`.

You may want to add an alias to your shell to reduce the typing:

```
alias r='docker-compose -f build.yml run --rm'
```

Then execute commands with:

```
r drush cr
```

If you have Node 4 and npm 2 available in your local environment, you can also run:

```
npm run d 'cli'
```

### Common Operations

These operations are for local development.

* **Start Containers:** `docker-compose up`
* **Build the Site:** `docker-compose -f build.yml run grunt`
* **Open a Terminal Session to the Web Host container:** `docker-compose exec www bash`
* **Fix File Permissions:** `docker-compose exec www /var/www/bin/fix-perms.sh`
* **Open a Terminal Session to the Virtual machine:** `docker-machine ssh dev`

## Services

* **Website:** [http://www.<%= domain %>.vm](http://www.<%= domain %>.vm)
<% if (proxy.exists) { %>* **Website w/out Varnish:** [http://app.<%= domain %>.vm](http://app.<%= domain %>.vm)<% } %>
<% if (mail.exists) { %>* **MailHog Service:** http://mail.<%= domain %>.vm](http://mail.<%= domain %>.vm)<% } %>
* **Database:** `db.<%= domain %>.vm`
    * **User**: `admin`
    * **Password**: `admin`
    * **Database**: `<%= machineName %>_drupal`
