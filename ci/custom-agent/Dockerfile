FROM jenkins/inbound-agent:latest

USER root

# Install dependencies, Docker (daemon + CLI), and utilities
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      curl \
      unzip \
      iptables \
      docker.io \
    && rm -rf /var/lib/apt/lists/*

# Install Sonar Scanner (adjust version as needed)
ENV SONAR_SCANNER_VERSION=5.13.0.36187 \
    SONAR_SCANNER_DIR=/opt/sonar-scanner
RUN curl -fsSL -o /tmp/sonar-scanner.zip \
      https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip \
    && unzip /tmp/sonar-scanner.zip -d /opt \
    && ln -s /opt/sonar-scanner-${SONAR_SCANNER_VERSION}-linux ${SONAR_SCANNER_DIR} \
    && ln -s ${SONAR_SCANNER_DIR}/bin/sonar-scanner /usr/local/bin/sonar-scanner \
    && rm -f /tmp/sonar-scanner.zip

# Pre-create Docker directories to avoid permission issues
RUN mkdir -p /var/lib/docker && chown -R jenkins:jenkins /var/lib/docker

# Return to jenkins user (the Kubernetes plugin will pass JNLP args)
USER jenkins

# Note: dockerd needs privileged container in Kubernetes. In the Pipeline,
# we will start it with something like:
#   sh "nohup dockerd --host=unix:///var/run/docker.sock --storage-driver=overlay2 >/tmp/dockerd.log 2>&1 & sleep 10"
