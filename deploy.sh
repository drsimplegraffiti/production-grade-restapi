#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: commit message not provided"
    exit 1
fi