#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: commit message not provided"
    exit 1
fi

#  add and push to github
git add .
git commit -m "$1"
git push origin main

# push code to heroku
git push heroku main

# restart the server
heroku restart
heroku open 