#!/bin/sh

NAME=$1
ENV_VARS=$2

gcloud functions deploy "$NAME" \
    --entry-point "$NAME" \
    --region us-east1 \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars "$ENV_VARS" \
    --timeout 300s \
    --memory 1024MB
