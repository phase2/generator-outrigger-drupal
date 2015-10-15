## Running on Docker

If you are running this project using Docker, you will not need to follow the
installation steps above. Instead, installation and hosting is combined into
the Docker plumbing. Read more about how Phase2 uses Docker in the [_devtools
repository](https://bitbucket.org/phase2tech/_devtools_vm).

* **Start Servers:** `docker-compose up`
* **Build the Site:** `docker-compose -f build.yml run grunt`
* **Open an Interactive Terminal Session:** `docker-compose -f build.yml run cli`
* **Run Drush Command:** `docker-compose -f build.yml run drush <command>`
* **Run Grunt Command:** `docker-compose -f build.yml run grunt [<command>]`

Navigate to your site at **[http://www.<%= projectName %>.vm](http://www.<%= projectName %>.vm)**.

Connect to your database at **`db.<%= projectName %>.vm`**.
