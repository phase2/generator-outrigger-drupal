## Running on Docker

Running this project on Docker you have streamlined installation steps. The Docker configuration in this repository handles all necessary environment setup for local
development or testing environments.

Local environments assume the use of Phase2's "DevTools" utility to manage the
filesystem, DNS, and any necessary virtualization. Read more about this in the
[Phase2 DevTools documentation](http://phase2.github.io/devtools/).

### First-time Setup

With a working DevTools installation, you can have a locally-hosted, web-browsable
site instance in just a few minutes with two commands.

```bash
git clone git@bitbucket.org:phase2tech/<%= projectName %>
bin/start.sh
```

You can use the `start.sh` script later if you want, but please review to ensure
familiarity with the underlying operations.

### Common Operations

These operations are for local development.

* **Start Containers:** `docker-compose up`
* **Build the Site:** `docker-compose -f build.yml run grunt`
* **Open an Interactive Terminal Session:** `docker-compose -f build.yml run cli`
* **Run Drush Command:** `docker-compose -f build.yml run drush <command>`
* **Run Grunt Command:** `docker-compose -f build.yml run grunt [<command>]`

### Services

* **Website:** [http://<%= host.local %>](http://<%= host.local %>)
* **Database:** `db.<%= domain %>.vm`

## Further Reading

See `CONTRIBUTING.md` and `JENKINS.md` in this repository for more details on
development processes and expectations.
