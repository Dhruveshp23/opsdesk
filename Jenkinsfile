pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_DEFAULT_REGION = 'us-east-1'
        IMAGE_NAME = 'dhruveshp23/opsdesk'
    }

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
                bat "docker build -t %IMAGE_NAME%:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat 'docker login -u %DOCKERHUB_CREDENTIALS_USR% -p %DOCKERHUB_CREDENTIALS_PSW%'
                bat "docker push %IMAGE_NAME%:latest"
            }
        }

        stage('Get EC2 IP') {
            steps {
                script {
                    env.EC2_IP = bat(
                        script: '@aws ec2 describe-instances --filters "Name=tag:Name,Values=opsdesk-server" "Name=instance-state-name,Values=running" --query "Reservations[0].Instances[0].PublicIpAddress" --output text',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    bat '''
                        icacls "%SSH_KEY%" /inheritance:r
                        icacls "%SSH_KEY%" /grant:r "NT AUTHORITY\\SYSTEM:R"
                        ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" %SSH_USER%@%EC2_IP% "docker pull %IMAGE_NAME%:latest && docker stop opsdesk-app || echo no-op && docker rm opsdesk-app || echo no-op && docker run -d --restart unless-stopped -p 3000:3000 --env-file /home/ec2-user/.env --name opsdesk-app %IMAGE_NAME%:latest"
                    '''
                }
            }
        }
    }
}