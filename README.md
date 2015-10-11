# Generator: P2 Environment

> Generate P2 environment configuration for your new or existing Drupal project
with Yeoman. Provides specific integration with Docker and Grunt-Drupal-Tasks.

This project generates usable default Docker and environment configurations for
your [Grunt-Drupal-Tasks](https://github.com/phase2/grunt-drupal-tasks)-based
Drupal project. For best results, please use the [Yo P2! generator](https://bitbucket.org/phase2tech/generator-p2).

## Features

* `docker-compose.yml` file for local development.
* `docker-compose.int.yml` file for integration environments.
* `build.yml` for running development operations on your Drupal site.
* README addition to describe how to work with the Docker environment.

## Installation

```
npm install -g git+ssh://bitbucket.org/phase2tech/generator-p2.git#master
```

## Run the Generator

```
yo p2-env
```
