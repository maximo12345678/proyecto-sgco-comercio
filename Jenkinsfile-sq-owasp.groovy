pipeline {
    agent any

    tools {
        nodejs '18.16.0'        
    }    

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {
        stage('Preparation') {
            steps {
                echo 'Proceso de Preparación..............'
                cleanWs()                
                 git branch: 'master', credentialsId: 'jenkins-gitbb', url: 'https://bitbucket.org/multicaja-cloud/mcf-bo-sgc-comercio.git'               
               
            }
        }        

        stage('Build'){
            steps{
                echo 'Construcción del Proyecto Microfront......'
                    sh 'npm install && npm run build'                    
                    
            }
        }

        stage('OWASP'){
            steps{
                echo 'Análisis Vulnerabilidad OWASP..............'
                    dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'owasp'
                    dependencyCheckPublisher failedTotalCritical: 3, failedTotalHigh: 15, pattern: 'dependency-check-report.xml'
                    script{
                        if (currentBuild.result == 'UNSTABLE') {
                        unstable('UNSTABLE: Dependency check')
                        } else if (currentBuild.result == 'FAILURE') {
                        error('FAILED: Dependency check')
                        }
                    }
            }
        }

        stage('Analysis SonarQube') {           
            steps{
                echo 'SonarQube......'
                   script {
                       scannerHome = tool 'sq-4.8.0.2856'
                       }
                       withSonarQubeEnv('sq_bst') {
                           sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${JOB_NAME} -Dsonar.sources=src/ -Dsonar.exclusions=src/assets/vendor/**"
                  }
                }
        }   
        
        stage("Quality Gate") {
            steps{
                echo 'Validación de Calidad del Código'
                    timeout(time: 1, unit: 'HOURS') {
                            waitForQualityGate abortPipeline: true
                    }
            }
        }

        

            
    }
}   
