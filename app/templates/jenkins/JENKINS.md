# Jenkins Integration

This project is packaged with the ability to easily spin up a project-specific Jenkins instance to facilitate some of the operational practices of the Phase2 development process. This includes maintaining standing environments, performing overnight tasks without developer involvement, and reporting on problems.

Like the application this repository is dedicated to, Jenkins is hosted via Docker infrastructure. It has been tested to function in both a local _devtools_vm environment as well as the Phase2 CI server.

This system does a majority of it's work by spinning up Docker containers for the different environments of the project and executing necessary commands to build code, run tests, or generate reports.

## Starting Up Jenkins

```bash
docker-compose -f jenkins.yml run jenkins
```

## Accessing Private Repositories

When you startup Jenkins, there are instructions for what to do to get Jenkins access to private repositories.

## Developing Your Jenkins System

By pulling Jenkins into the project repository it is now under more direct control by the development team. The recommended approach is to focus on Jenkins as a "thin controller", carrying the minimum functionality to execute it's needs as a Docker-based CI & build tool. Most of the functionality should be found in tools or scripts that are leveraged by Jenkins, perhaps from the `bin/` directory.

### Maintained Jenkins Configuration

Jenkins has key configuration maintained as part of the project codebase.

* The main configuration can be viewed at `env/jenkins/config.xml`
* Individual jobs are found in `env/jenkins/jobs`.

When working with the Jenkins UI to make changes, configuration will be directly written to these files. This way you can manage Jenkins changes as part of the development process.

### Default Jenkins Jobs

There are several Jenkins jobs packaged in the repository.

* **ci**: Triggered by every push to the configured Git repository, CI runs all tests and checks and reports back on the health of the code branch.
* **dev-support:** Produces a nightly snapshot database of a clean install. This is made available at `/opt/backups/nightlies`. The most recent snapshot can be found at `/opt/backups/latest.sql.gz`. Also runs a module updates scan.
* For each supported environment (Development, QA, Review) has a deployment and cron job.
* **jenkins-test-default:** A simple job to confirm Jenkins is working.
* **jenkins-test-docker:** A simple job to confirm Jenkins can run docker commands.

### Updating for Use Outside Phase2 Infrastructure

Phase2 uses [Flowdock](https://flowdock.com) for team messaging, commonly the Jenkins jobs are configured to send a message to the project chat room. Please reconfigure or disable that setting when using this to set up Jenkins outside a Phase2 environment.
