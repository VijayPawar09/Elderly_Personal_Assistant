pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
            defaultContainer 'jnlp'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:24.0.6-cli  # Docker CLI
    command:
    - cat
    tty: true
  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest  # SonarQube scanner
    command:
    - cat
    tty: true
"""
        }
    }

    environment {
        SONAR_HOST_URL = 'http://sonarqube.imcc.com/'
        SONAR_LOGIN = 'student'
        SONAR_PASSWORD = 'Imccstudent@2025'

        NEXUS_URL = 'nexus.imcc.com'
        NEXUS_USER = 'student'
        NEXUS_PASS = 'Imcc@2025'
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
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

        stage('Build & Push Backend') {
            steps {
                container('docker') {
                    sh "docker build -t ${NEXUS_URL}/backend:latest ./backend"
                    sh "echo ${NEXUS_PASS} | docker login -u ${NEXUS_USER} --password-stdin http://${NEXUS_URL}"
                    sh "docker push ${NEXUS_URL}/backend:latest"
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                container('docker') {
                    sh "docker build -t ${NEXUS_URL}/frontend:latest ./frontend"
                    sh "docker push ${NEXUS_URL}/frontend:latest"
                }
            }
        }
    }

    post {
        always {
            container('docker') {
                sh "docker rmi ${NEXUS_URL}/backend:latest || true"
                sh "docker rmi ${NEXUS_URL}/frontend:latest || true"
                sh "docker logout http://${NEXUS_URL} || true"
            }
        }
    }
}
