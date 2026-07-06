pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Docker image') {
            steps {
                bat 'docker build -t opsdesk-app .'
            }
        }
    }
}