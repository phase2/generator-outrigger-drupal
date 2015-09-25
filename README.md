# `yo p2` - the Phase2 site generator

This project is a **Work In Progress** that is in the process of leaving alpha testing for beta testing. This project is currently being intended for internal use only.

## `yo p2` Overview

Think of this as an umbrella yeoman generator that asks questions, then pass the answers to multiple other yeoman generators that handle their own aspect of the scaffolding. Here are the projects that come together to form the result:

### Grunt Drupal Tasks

The installation and setup of [GDT](https://github.com/phase2/grunt-drupal-tasks) is handled by it's yeoman generator, [Gadget](https://github.com/phase2/generator-gadget). 
 
### Pattern Lab Starter

The installation and setup of a theme using [Pattern Lab Starter](http://git.io/p2pls) is handled by it's [yeoman generator](https://github.com/phase2/generator-pattern-lab-starter).

The back end handled by GDT and the front end handled by Pattern Lab Starter, are both linked using the [Theme Scripts of GDT](https://github.com/phase2/grunt-drupal-tasks/blob/master/CONFIG.md#theme-scripts) so that way a full site compile can happen by running `grunt` from the root.

### Installation

Dependencies:

```bash
npm install --global yo
```

To install this generator:

```bash
npm install --global git+ssh://bitbucket.org/phase2tech/generator-p2.git#master
```

Finally, make an empty folder, and initiate the generator:

```bash
yo p2
```
