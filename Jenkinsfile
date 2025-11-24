pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
            defaultContainer 'jnlp'
            yaml """
apiVersion: v1
kind: Pod
spec:
  imagePullSecrets:
  - name: dockerhub-creds
  containers:
  - name: docker
    image: docker:24.0.6-cli  # Docker CLI
    command:
    - cat
    tty: true
    env:
    - name: DOCKER_HOST
      value: tcp://localhost:2375
    - name: DOCKER_TLS_CERTDIR
      value: ""
  - name: dind
    image: docker:24.0.6-dind
    securityContext:
      privileged: true
    args:
    - --host=tcp://0.0.0.0:2375
    - --storage-driver=overlay2
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-graph-storage
      mountPath: /var/lib/docker
  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest  # SonarQube scanner
    command:
    - cat
    tty: true
  volumes:
  - name: docker-graph-storage
    emptyDir: {}
"""
        }
    }

    environment {
        SONAR_HOST_URL = 'http://sonarqube.imcc.com/'

        NEXUS_URL = 'nexus.imcc.com'
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'sonar-creds', usernameVariable: 'SONAR_LOGIN', passwordVariable: 'SONAR_PASSWORD')
                ]) {
                    container('sonar') {
                        sh """
                            sonar-scanner \
                            -Dsonar.projectKey=elderly-personal-assistance \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.login=${SONAR_LOGIN} \
                            -Dsonar.password=${SONAR_PASSWORD}
                        """
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')
                ]) {
                    container('docker') {
                        sh "docker version"
                        sh "docker build -t ${NEXUS_URL}/backend:latest ./backend"
                        sh "echo ${NEXUS_PASS} | docker login -u ${NEXUS_USER} --password-stdin http://${NEXUS_URL}"
                        sh "docker push ${NEXUS_URL}/backend:latest"
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')
                ]) {
                    container('docker') {
                        sh "docker build -t ${NEXUS_URL}/frontend:latest ./frontend"
                        sh "echo ${NEXUS_PASS} | docker login -u ${NEXUS_USER} --password-stdin http://${NEXUS_URL}"
                        sh "docker push ${NEXUS_URL}/frontend:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Post-cleanup skipped when agent/pod is unavailable.'
        }
    }
}
