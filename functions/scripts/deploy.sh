#!/bin/sh

ENV_VARS="CLIENT_ID=$1,CLIENT_SECRET=$2,USER_AGENT=$3,REDDIT_USERNAME=$4,REDDIT_PASSWORD=$5,KERAS_PREDICTION_URL=$6"

gcloud functions deploy scrapePosts \
    --entry-point scrapePosts \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars "$ENV_VARS" \
    --timeout 300s \
    --memory 1024MB

gcloud functions deploy ingestPosts \
    --entry-point ingestPosts \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars "$ENV_VARS" \
    --timeout 300s \
    --memory 1024MB

gcloud functions deploy predict \
    --entry-point predict \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars "$ENV_VARS" \
    --timeout 300s \
    --memory 1024MB
