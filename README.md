Assignment (Readme)



Pre-requisite -

1.	Basic knowledge of helm, docker and k8s is required.
2.	Helm 2.0+ must be installed with tiller for deployment process. (https://helm.sh/docs/using_helm/)


•	I will be deploying a simple nodejs application that give version on /version http call.


Deployment –

•	Here we will be using Helm Charts. Helm uses a packaging format called charts. A chart is a collection of files that describe a related set of Kubernetes resources.<br/>
•	I have created the helm charts for nodejs service.

•	Now the deployment steps will be as follows –
1.	Now as we have K8s cluster up and running, we will be creating namespace "dev".
2.	Build the docker image by running this command in “Dockerfile” directory –

docker build -t gcr.io/zen-genius-214716/version-app:0.0.1 .
(I was using my GCR, that’s why I tagged it with the above name)

3.	Run “helm lint”. It  runs a series of tests to verify that the chart is well-formed and has no failures.
4.	Run “helm init  --serviceaccount <deployer_rights_serviceaccount_only>”. It will initialise the helm and will install Tiller to your running Kubernetes cluster. It will also set up any necessary local configuration.
5.	Now using helm as our deployment tool, run the following commands for deploying application in "dev" namespace.

•	helm install versionapp --name versionapp --values versionapp/values.yaml --namespace dev --set service.type=NodePort
(To access the service from outside the Kubernetes, I have set the service type to NodePort)

7.	Now we will see that the pods are up and running and we can access the service through NodePort or make an ingress entry.
8.	To access the webservice, just go to http://{k8s_URL}:{NodePort}.


NOTE –

Further adding some points here,
1.	For logging we can use ELK(Elasticsearch-Logstash-Kibana) stack which will also be easier for developers to analyse from a UI based logs system. 
2.	For alerting and monitoring, we can use Prometheus/Grafana for k8s monitoring and Zabbix/Grafana for instance monitoring. If the pods or machine gets down, we will get alerts and can take the action accordingly.
3. How to use the above services with minimum downtime-
    (Let us consider the current environment as "Blue" deployment),
 
    a) Create a kubernetes environment with all the services and configurations.<br/>
    b) We can then transfer the few traffic to green deployment by changing the
       outes/service to point to the new k8s-cluster, for minimum downtime and loads of traffic - we can have multiple pods in        k8s environment of that service (Load- Balancing).<br/>
    c) If we observe that the new green deployment is handling requests/traffic efficiently and there are no issues, then we          will be switching all the routes/services to the green deployment (few at a time) and if is not the case - we will be          switching back to blue deployment (Roll-Back).<br/>
    d) If we follow the above steps, we will have minimum downtime and the load will also be distributed, keeping the                server/service in good shape.<br/>
    e) For multiple environments for developers and testers, we can create namespaces (within that cluster) or a new cluster          separately for both the teams (which is ideal). As kubernetes is opensource, it will be very much cost efficient, only        the vms cost of aws will be there – which will be comparatively less then on-premise vms.<br/>
    f) With end-to-end CI/CD pipeline – Bitbucket/Git -> Jenkins Pipeline -> Spinnaker, we can achieve deployment multiple            times a day just by single commit by the developer in their bitbucket.

