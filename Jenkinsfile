pipeline {
    agent any
    
    tools {
        nodejs "NODE_HOME"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Mrezky69/Simple-Crud-Express.git'
            }
        }        
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        def hasTestScript = bat(script: 'npm run | findstr test', returnStatus: true) == 0
                        if (hasTestScript) {
                            bat 'npm test'
                        } else {
                            echo 'No test script found in package.json, skipping tests.'
                        }
                    } else {
                        echo 'package.json not found, skipping tests.'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                bat 'npm start'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline selesai!'
        }
        success {
            echo 'Build sukses!'
        }
        failure {
            echo 'Build gagal.'
        }
    }
}
