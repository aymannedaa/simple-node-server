# Simple nodejs express webserver

Using Ansible this project deploys into a clean Ubuntu AWS EC2 instance an Nginx Reverse Proxy that is used to enable HTTPS support and act as a load balancer redirecting HTTP/HTTPS traffic to 2 docker containers each running a simple http webserver using Express and Node, installing all the necessary software packages to allow the containers to run.

A CI/CD pipeline has been created with Jenkins that listens to push changes on master branch then runs the unit tests and if successful builds the docker image and pushes it to dockerhub. Then Jenkins uses Ansible playbooks to provision an EC2 instance, stopping the first docker containers (if exists), removing the image and running the new one (pulling the new image from dockerhub). Then doing the same for the 2nd docker container so that there is no downtime for the whole application. Using docker compose would be a better approach in handling this (See TODO list at the end of this Readme). Finally Ansible runs the Nginx setup playbook to setup Nginx, install the necessary SSL certificate using Certbot and reloads Nginx configuration.

## API Endpoints:

```
/demo
```

returns a response ```I'm alive!``` as a body with content-type text/html.

```
/
```

returns the main page of the webserver with the current project version.

---
## Requirements

### Node.js v12 or higher

check [official Node.js website](https://nodejs.org/) for download and installation instructions depending on your OS.

---

## Install

```
npm install
```

## Running the app in development

```
npm start
```

Go to ```localhost:3000/demo``` in your browser to see the result.

---

## Use Docker
You can also run this app as a Docker container:

Build the Docker image

```
docker build -t node-server .
```

Run the Docker container locally:

```
docker run -p 3000:3000 -d node-server
```

---

## Ansible

### Setup Steps to run Ansible in your own environment:

- Install Ansible, for instructions refer to: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html
- Create an AWS EC2 instance(s):
    - Go to AWS console and create a new EC2 instance having Ubuntu Server 16.04 or 18.04.
    - Select the instance type that suits you, but t2.micro should be good enough for our purposes.
    - Keep on selecting ```next``` until you reach the step to add a new security group.
    - Click ```add new security group``` then click on ```Add Rule``` and select ```HTTP``` then click ```Review and launch``` button.
    - Download the instance key (.pem) file and save it to a safe place on your computer.
    - In AWS EC2 dashboard find the instance public IP address.
- Clone this repo and cd ```simple-node-server/Ansible```.
- Make a directory with the name ```.keystore```.
- Copy the instance key downloaded earlier to the ```.keystore``` folder.
- Go to hosts file and change the ip address of the instance with that of your own instance.
- For the nginx-setup-playbook.yml change all occurances of ```muistini.com``` with the domain name that you own.
- Change the A record of the domain name you own to point to the IP address of your AWS EC2 instance.

## Run Ansible

```cd``` into ```simple-node-server/Ansible```, and run:

```
./production-run.sh
```

Navigate to ```<instance public IP address>/demo``` in your browser to see the result.

---

## TODO (Upcoming improvements and new features)
- ~Use HTTPS~
- Allow hosts IPs and keys to be given to Ansible as environment variables
- Use ```Helmet``` to set security-related HTTP response headers, refer to: https://expressjs.com/en/advanced/best-practice-security.html
- Use Docker Compose or Kubernetes for container deployment and orchestration.
- Use Ansible to create AWS EC2 instances (hosts and control servers) as a pre-step to docker-setup-playbook.yml
- Use Ansible to create CI infrastructre (Jenkins) and pipeline
- Use Ansible for scaling and load balancing
- Use Blue-green deployment
- Use swagger for API documentation
- Set up renovate on github for automatic dependency updates
- Migrate to Typescript :)
