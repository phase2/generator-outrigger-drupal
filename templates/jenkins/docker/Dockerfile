FROM jenkins

USER root

# Add Jenkins system config file
COPY config.xml /var/jenkins_home/config.xml

COPY plugins.txt /usr/share/jenkins/plugins.txt

RUN /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt

# Add symlink for libdevmapper to fix docker-compose from host
RUN ln -s /lib/x86_64-linux-gnu/libdevmapper.so.1.02.1 /lib/x86_64-linux-gnu/libdevmapper.so.1.02
