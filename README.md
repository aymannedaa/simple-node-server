# Simple nodejs express webserver

Using Ansible this project deploys a docker container having a simple http webserver written in express and nodejs into one or more clean Ubuntu AWS EC2 instance(s), installing all the necessary software packages to allow the container to run.

A CI/CD pipeline has been created with Jenkins that listens to push changes on master branch then runs the unit tests and if successful builds the docker image and pushes it to dockerhub. Then Jenkins uses Ansible playbooks to provision one or more EC2 instances, stopping the previous docker container (if it exists), removing the image and running a new one (pulling the new image from dockerhub).

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
- Go to hosts file and change the ip address of the instance(s) with that of your own instance (if you plan to use only one instance remove the line starting with ```ubuntu-server-2```).

## Run Ansible

```cd``` into ```simple-node-server/Ansible```, and run:

```
./production-run.sh
```

Navigate to ```<instance public IP address>/demo``` in your browser to see the result.

### Example output logs from running ansible
PLAY [webservers] **************************************************************

TASK [Gathering Facts] *********************************************************
ok: [ubuntu-server-1]
ok: [ubuntu-server-2]
ok: [ubuntu-server-3]

TASK [Add Docker Ubuntu's repository key to APT's trusted package sources] *****
ok: [ubuntu-server-1]
ok: [ubuntu-server-2]
changed: [ubuntu-server-3]

TASK [Add docker repo] *********************************************************
ok: [ubuntu-server-1]
ok: [ubuntu-server-2]
changed: [ubuntu-server-3]

TASK [Update repositories cache and install "docker-ce" package] ***************
ok: [ubuntu-server-1]
ok: [ubuntu-server-2]
changed: [ubuntu-server-3]

TASK [Install required system packages] ****************************************
ok: [ubuntu-server-2] => (item=python3-pip)
ok: [ubuntu-server-1] => (item=python3-pip)
ok: [ubuntu-server-2] => (item=virtualenv)
ok: [ubuntu-server-1] => (item=virtualenv)
ok: [ubuntu-server-2] => (item=python3-setuptools)
ok: [ubuntu-server-1] => (item=python3-setuptools)
changed: [ubuntu-server-3] => (item=python3-pip)
changed: [ubuntu-server-3] => (item=virtualenv)
ok: [ubuntu-server-3] => (item=python3-setuptools)

TASK [Install Docker Module for Python] ****************************************
ok: [ubuntu-server-1]
ok: [ubuntu-server-2]
changed: [ubuntu-server-3]

TASK [Add user to docker group] ************************************************
ok: [ubuntu-server-2]
ok: [ubuntu-server-1]
changed: [ubuntu-server-3]

PLAY RECAP *********************************************************************
ubuntu-server-1            : ok=7    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
ubuntu-server-2            : ok=7    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
ubuntu-server-3            : ok=7    changed=6    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

[ansible-deploy] $ ansible-playbook /home/ubuntu/ansible/docker-deploy-playbook.yml -i /home/ubuntu/ansible/hosts -f 5

PLAY [webservers] **************************************************************

TASK [Gathering Facts] *********************************************************
ok: [ubuntu-server-2]
ok: [ubuntu-server-1]
ok: [ubuntu-server-3]

TASK [Stop node server container] **********************************************
changed: [ubuntu-server-2]
changed: [ubuntu-server-1]
changed: [ubuntu-server-3]

TASK [remove node server container] ********************************************
changed: [ubuntu-server-2]
changed: [ubuntu-server-1]
changed: [ubuntu-server-3]

TASK [Remove image] ************************************************************
changed: [ubuntu-server-2]
changed: [ubuntu-server-1]
changed: [ubuntu-server-3]

TASK [Run node server container] ***********************************************
changed: [ubuntu-server-2]
changed: [ubuntu-server-1]
changed: [ubuntu-server-3]

PLAY RECAP *********************************************************************
ubuntu-server-1            : ok=5    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
ubuntu-server-2            : ok=5    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
ubuntu-server-3            : ok=5    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

---

## TODO (Upcoming improvements and new features)
- Allow hosts IPs and keys to be given to Ansible as environment variables
- Use HTTPS, doing so is easy in node just follow these steps:
    - Use [Let’s Encrypt](https://letsencrypt.org/) to generate SSL certificates for free
    - Use Nodejs [HTTPS native module](https://nodejs.org/api/https.html) and add the following to ```app.js```:
    ```
    const https = require("https");
    const fs = require("fs");
    const options = {
        key: fs.readFileSync("PATH/TO/key.pem"),
        cert: fs.readFileSync("PATH/TO/chain.pem")
    };
    https.createServer(options, app).listen(443);
    ```
    - Modify Dockerfile by replacing ```EXPOSE 3000``` with ```EXPOSE 3000 443```

- Use ```Helmet``` to set security-related HTTP response headers, refer to: https://expressjs.com/en/advanced/best-practice-security.html
- Use Docker Compose or Kubernetes for container deployment and orchestration.
- Use Ansible to create AWS EC2 instances (hosts and control servers) as a pre-step to docker-setup-playbook.yml
- Use Ansible to create CI infrastructre (Jenkins) and pipeline
- Use Ansible for scaling and load balancing
- Use Blue-green deployment
- Use swagger for API documentation
- Set up renovate on github for automatic dependency updates
- Migrate to Typescript :)