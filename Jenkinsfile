pipeline {
    agent {
        kubernetes {
            label 'custom-agent'
            defaultContainer 'jnlp'
            yaml '''
apiVersion: v1
kind: Pod
spec:
  imagePullSecrets:
  - name: nexus-secret
  containers:
  - name: jnlp
    image: nexus.imcc.com/library/custom-jenkins-agent:latest
    args:
    - "$(JENKINS_SECRET)"
    - "$(JENKINS_NAME)"
    securityContext:
      privileged: true
    volumeMounts:
    - name: docker-graph-storage
      mountPath: /var/lib/docker
  volumes:
  - name: docker-graph-storage
    emptyDir: {}
'''
        }
    }

    environment {
        SONAR_HOST_URL = 'http://sonarqube.imcc.com/'

        NEXUS_URL = 'nexus.imcc.com'
    }

    stages {
        stage('Start Docker Daemon') {
            steps {
                container('jnlp') {
                    sh '''
                        if ! pgrep dockerd >/dev/null 2>&1; then
                          nohup dockerd --host=unix:///var/run/docker.sock --storage-driver=overlay2 >/tmp/dockerd.log 2>&1 &
                          sleep 10
                        fi
                        docker info
                    '''
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'sonar-creds', usernameVariable: 'SONAR_LOGIN', passwordVariable: 'SONAR_PASSWORD')
                ]) {
                    container('jnlp') {
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
                    container('jnlp') {
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
                    container('jnlp') {
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
