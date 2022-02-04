#!/bin/sh

NAME=$1
ENV_VARS=$2

gcloud functions deploy "$NAME" \
    --entry-point "$NAME" \
    --region us-east1 \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars "$ENV_VARS" \
    --timeout 300s \
    --memory 1024MB

gcloud functions add-iam-policy-binding "$NAME" \
    --region us-east1 \
    --member="serviceAccount:602308134174-compute@developer.gserviceaccount.com" \
    --role="roles/cloudfunctions.invoker" || true

