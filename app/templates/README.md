<% include ../../node_modules/generator-gadget/app/templates/README.md %>
<% if (useENV) { %><% include ../../environment/templates/docs/README.md %><% } -%>

## Scaffolded with Generators

Initial generation of this project's code structure was built with [Yo P2](https://bitbucket.org/phase2tech/generator-p2)
and related code-generation projects.

To refresh your project with our latest practices, update your local copy of this
tool, and run `yo p2 --replay --force`. Do not forgot to carefully inspect each
change for compatibility with your ongoing project before committing.

The `--replay` option pulls configuration values for the generator from *.yo-rc.json*,
where they can be reviewed or edited by experts at any time.
