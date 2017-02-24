FROM node:4-alpine

ENV YO_P2_VERSION 2.2.0
ENV PATTERN_LAB_STARTER_VERSION 2.0.0
ENV GADGET_VERSION 1.0.0-rc1
ENV P2_ENV_VERSION 1.2.0

RUN node -v
RUN npm -v
RUN echo "Yeoman Doctor will warn about our npm version being outdated. It is expected and OK."
RUN npm install --global --silent yo
RUN npm install --global --silent generator-gadget@v$GADGET_VERSION
RUN npm install --global --silent generator-pattern-lab-starter@v$PATTERN_LAB_STARTER_VERSION
# These generators remain private and so cannot be installed yet.
# RUN npm install --global --silent git+ssh://bitbucket.org/phase2tech/generator-p2.git#v$YO_P2_VERSION
# RUN npm install --global --silent git+ssh://bitbucket.org/phase2tech/generator-p2-env.git#v$P2_ENV_VERSION

# Add a yeoman user because Yeoman freaks out and runs setuid(501).
# This was because less technical people would run Yeoman as root and cause problems.
# Setting uid to 501 here since it's already a random number being thrown around.
# @see https://github.com/yeoman/yeoman.github.io/issues/282
# @see https://github.com/cthulhu666/docker-yeoman/blob/master/Dockerfile
RUN adduser -D -u 501 yeoman && \
  echo "yeoman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Yeoman needs the use of a home directory for caching and certain config storage.
ENV HOME /home/yeoman

RUN mkdir /generated && chown yeoman:yeoman /generated
WORKDIR /generated

# Always run as the yeoman user
USER yeoman

CMD /usr/bin/env sh

# Run a Yeoman generator with a command such as:
# docker build -t yeoman .
# docker run -it -v "/Users/username/Projects/newproject:/generated" --rm yeoman yo gadget --no-insight --skip-install

# The --no-insight flag is recommended to avoid prompts for usage collection.
# @see https://github.com/yeoman/yo/issues/20
