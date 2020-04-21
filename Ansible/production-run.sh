#!/bin/bash

echo "Setting up servers..."
time ansible-playbook docker-setup-playbook.yml
echo "Set up done!"

echo "Deploying containers into servers..."
time ansible-playbook docker-deploy-playbook.yml
echo "Deployment Done!"

echo "Setting up proxy server..."
time ansible-playbook nginx-setup-playbook.yml
echo "Set up done!"