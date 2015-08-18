FROM ubuntu:14.04

MAINTAINER Seva Dolgopolov

ENV UPDATED 12-08-2015

RUN apt-get update && apt-get install -y build-essential 
RUN curl -sL https://deb.nodesource.com/setup | sudo bash - && apt-get update
RUN apt-get install -y nodejs-legacy npm

CMD ["/usr/bin/node", "/var/www/server"]

EXPOSE 3001
