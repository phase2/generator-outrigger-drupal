## Running on Docker

If you are running this project using Docker, you will not need to follow the
installation steps above. Instead, installation and hosting is combined into
the Docker plumbing. Read more about how Phase2 uses Docker in the [_devtools
repository](https://bitbucket.org/phase2tech/_devtools_vm).

### First-time Setup

Once the repository is cloned, all you need to do to build the system and get a
working Drupal site is run the start script in the `bin/` directory. This script
is also used in Jenkins jobs, so customizations should be made with care.

```bash bin/start.sh```

### Common Operations

* **Start Servers:** `docker-compose up`
* **Build the Site:** `docker-compose -f build.yml run grunt`
* **Open an Interactive Terminal Session:** `docker-compose -f build.yml run cli`
* **Run Drush Command:** `docker-compose -f build.yml run drush <command>`
* **Run Grunt Command:** `docker-compose -f build.yml run grunt [<command>]`

### Resources

* **Website:** [http://www.<%= domain %>.vm](http://www.<%= domain %>.vm)
* **Database:** `db.<%= domain %>.vm`
