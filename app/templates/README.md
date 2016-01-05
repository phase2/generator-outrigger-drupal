## Running on Docker

If you are running this project using Docker, you will not need to follow typical installation steps. By setting up a Docker system in your local or server environment, the Docker configuration and related tooling in this repository will facilitate **all the dependencies and actions** needed to get the application up and running. Read more about how Phase2 uses Docker in the [_devtools_vm repository](https://bitbucket.org/phase2tech/_devtools_vm).

### First-time Setup

Get the code and run the start script to set up Docker containers, build the codebase, and install the site.

```bash
git clone git@bitbucket.org:phase2tech/<%= projectName %>
bash bin/start.sh
```

### Common Operations

These operations are for local development.

* **Start Containers:** `docker-compose up`
* **Build the Site:** `docker-compose -f build.yml run grunt`
* **Open an Interactive Terminal Session:** `docker-compose -f build.yml run cli`
* **Run Drush Command:** `docker-compose -f build.yml run drush <command>`
* **Run Grunt Command:** `docker-compose -f build.yml run grunt [<command>]`

## Services

* **Website:** [http://www.<%= domain %>.vm](http://www.<%= domain %>.vm)
* **Database:** `db.<%= domain %>.vm`

## Further Reading

See `CONTRIBUTING.md` and `JENKINS.md` in this repository for more details on development processes and expectations.
