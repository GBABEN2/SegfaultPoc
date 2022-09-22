FROM registry.access.redhat.com/ubi8/ubi-minimal:8.6-941

USER root

# Install system dependencies
RUN microdnf module enable nodejs:14 && \
    microdnf update && \
    microdnf install -y \
      python3 \
      make \
      gcc-c++ \
      shadow-utils \
      glibc \
      nodejs-1:14.20.0-2.module+el8.6.0+16231+7c1b33d9.x86_64 \
      npm

# Install libnsl redhat package from rpm, as only libsnl2 is available in ubi repos
# (Downloaded from https://access.redhat.com/downloads/content/libnsl/2.28-189.5.el8_6/x86_64/fd431d51/package)
ARG libnsl="CI/libnsl-2.28-189.5.el8_6.x86_64.rpm"
COPY ${libnsl} /stage/${libnsl}
RUN rpm -i /stage/${libnsl} && \
     rm -f /stage/${libnsl}

# Add oracle instantclient repository and install instantclient
RUN curl -sS -o /etc/pki/rpm-gpg/RPM-GPG-KEY-oracle https://yum.oracle.com/RPM-GPG-KEY-oracle-ol8
RUN echo -e "[ol8_oracle_instantclient]\n\
name=Oracle Instant Client for Oracle Linux \$releasever (\$basearch)\n\
baseurl=https://yum.oracle.com/repo/OracleLinux/OL8/oracle/instantclient/\$basearch/\n\
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle\n\
gpgcheck=1\n\
enabled=0" > /etc/yum.repos.d/public-yum-ol8.repo
RUN microdnf install --nodocs --enablerepo=ol8_oracle_instantclient \
    oracle-instantclient19.16-basic

# Set up application directory
RUN useradd node
ENV APP_DIR="/home/node/app"
WORKDIR $APP_DIR
RUN chown -R node $APP_DIR && chmod 777 $APP_DIR

USER node

# Install node modules
COPY --chown=node:node package.json package-lock.json *.js ./
RUN npm ci

# Create dir for segfault logs
RUN mkdir crashlogs && chmod 777 crashlogs

EXPOSE 3000

CMD npm start
