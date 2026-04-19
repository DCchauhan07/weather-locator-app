pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        IMAGE_NAME     = "dcchauhan7/weather-locator-app"
        CONTAINER_NAME = "weather-app-container"
        BUILD_TAG      = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/DCchauhan07/weather-locator-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_TAG .'
                sh 'docker tag $IMAGE_NAME:$BUILD_TAG $IMAGE_NAME:latest'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                withCredentials([string(credentialsId: 'weather-api-key', variable: 'WEATHER_API_KEY')]) {
                    sh '''
                        docker run -d \
                          --name $CONTAINER_NAME \
                          -p 3000:3000 \
                          -e WEATHER_API_KEY=$WEATHER_API_KEY \
                          -e PORT=3000 \
                          $IMAGE_NAME:$BUILD_TAG
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $IMAGE_NAME:$BUILD_TAG
                        docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}
