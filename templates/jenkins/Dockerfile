FROM jenkins

USER root

COPY env/plugins.txt  /usr/share/jenkins/plugins.txt

RUN /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt
