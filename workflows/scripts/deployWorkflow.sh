#!/bin/sh

NAME=$1

gcloud workflows deploy "$NAME" \
    --source="$NAME.yaml" \
    --location=us-central1
