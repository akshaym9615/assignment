#!groovy

/**************************************************************************************************
***** Description :: This template is for CI/CD (Taking Version-App as an example) *******
***** Author *****:: Akshay Mishra *********
***** Date ******:: 1/06/2019 *******
**************************************************************************************************/

import hudson.model.*
import hudson.EnvVars

properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5'))])

imageName = "version-app"
summaryTemp = "Docker Image build or push failed: (${env.JOB_NAME}) (${env.BUILD_URL})"


//This fuction will checkout the repo to workspace
def funCodeCheckout() {
checkout scm
}

//We can write the test cases according to the language that will be used
def funUnitTest() {
echo "Dummy unit test"
}

//This step will compile your code(According to the language that needs to be build, will use plugin accordingly. Example - Maven for Java, Gradle for Android, npm for NodeJS and ReactJS) 
def funCodeCompile(){
echo "Code Compile"
}

//Sonar scanner will run for Quality Gate and Code Analysis
def funSonarAnalysis() {
    withSonarQubeEnv('SonarServer') {
        sh "soncar-scanner"
    }
}

//Docker image is build and pushed to the registry
def funDockerbuild() {
v = image.version
docker.withRegistry("http://$REGISTRY_PATH", "REGISTRY-CREDENTIALS") {
def customImage = docker.build("$REGISTRY_PATH/${imageName}:$v", "$WORKSPACE")
customImage.push()
}
}

//This step will deploy the image to the dev environment
def funDeploy() {
sh """
helm install serviceName --name serviceName --values serviceName/values.yaml --namespace dev
"""
}

//Code is published to the repo
def funPublish() {
def version = "${image.version}"

withCredentials([usernamePassword(credentialsId: 'REGISTRY-CREDENTIALS', passwordVariable: 'password', usernameVariable: 'user')]) {
sh "curl -v -u \"${user}\":\"${password}\" --upload-file file.zip $GENERIC_REPO/path/${version}.zip"
}
}

node('master') {

try{
stage ("Checkout") {funCodeCheckout()}
} catch (e) {
def subject = "Jenkins Checkout Error"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}

try{
stage ("Run Unit Tests"){funUnitTest()}
} catch (e) {
def subject = "Jenkins Unit Test Cases Failiure"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}

try {
stage ("Build") {funCodeCompile()}
} catch (e) {
def subject = "Jenkins Build Failure"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}


try {
stage ("Sonar Analysis") {funSonarAnalysis()}
} catch (e) {
def subject = "Jenkins Sonar Analysis Failed"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}

try {
stage ("Build Docker Image and Push") {funDockerbuild()}
} catch (e) {
def subject = "Jenkins Docker Push Failed"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}

try {
stage ("Deploy to the Dev Environment") {funDeploy()}
} catch (e) {
def subject = "Jenkins Deploy Failed"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}

try {
stage ("Publish the code") {funPublish()}
} catch (e) {
def subject = "Jenkins Publish Code Failed"
def summary = "${subject} (${env.JOB_NAME}) (${env.BUILD_URL})"
throw e
}
}
