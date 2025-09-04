pipeline {
  agent any
  stages {
    stage('Despliegue con Docker Compose') {
      steps {
        checkout scm
        sh 'docker compose down'
        sh 'docker compose build --no-cache'
        sh 'docker compose up -d'
      }
    }
  }
}
