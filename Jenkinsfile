pipeline {
    agent any

    environment {
        // Credentials provided by user
        // WARNING: In a production environment, use Jenkins Credentials Binding instead of plain text!
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
                script {
                    // Assuming sonar-scanner is available in the path
                    // If using SonarQube plugin, you can wrap this in withSonarQubeEnv('SonarQube')
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
                script {
                    echo 'Building Backend Docker Image...'
                    sh "docker build -t ${NEXUS_URL}/backend:latest ./backend"
                    
                    echo 'Logging into Nexus...'
                    sh "echo ${NEXUS_PASS} | docker login -u ${NEXUS_USER} --password-stdin http://${NEXUS_URL}"
                    
                    echo 'Pushing Backend Image to Nexus...'
                    sh "docker push ${NEXUS_URL}/backend:latest"
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    echo 'Building Frontend Docker Image...'
                    sh "docker build -t ${NEXUS_URL}/frontend:latest ./frontend"
                    
                    // Already logged in from previous stage
                    echo 'Pushing Frontend Image to Nexus...'
                    sh "docker push ${NEXUS_URL}/frontend:latest"
                }
            }
        }
    }

    post {
        always {
            // Clean up docker images to save space
            sh "docker rmi ${NEXUS_URL}/backend:latest || true"
            sh "docker rmi ${NEXUS_URL}/frontend:latest || true"
            sh "docker logout http://${NEXUS_URL} || true"
        }
    }
}
