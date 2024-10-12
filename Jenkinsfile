pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Mrezky69/Simple-Crud-Express.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'npm start'
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
