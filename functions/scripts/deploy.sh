#!/bin/sh

ENV_VARS="CLIENT_ID=${_CLIENT_ID},\
CLIENT_SECRET=${_CLIENT_SECRET},\
USER_AGENT=${_USER_AGENT},\
REDDIT_USERNAME=${_REDDIT_USERNAME},\
REDDIT_PASSWORD=${_REDDIT_PASSWORD},\
KERAS_PREDICTION_URL=${_KERAS_PREDICTION_URL}"

gcloud functions deploy scrapePosts \
    --entry-point scrapePosts \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars $ENV_VARS \
    --timeout 300s \
    --memory 1024MB

gcloud functions deploy ingestPosts \
    --entry-point ingestPosts \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars $ENV_VARS \
    --timeout 300s \
    --memory 1024MB

gcloud functions deploy predict \
    --entry-point predict \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --set-env-vars $ENV_VARS \
    --timeout 300s \
    --memory 1024MB

# Enable public access.

gcloud alpha functions add-iam-policy-binding scrapePosts --member=allUsers --role=roles/cloudfunctions.invoker

gcloud alpha functions add-iam-policy-binding ingestPosts --member=allUsers --role=roles/cloudfunctions.invoker

gcloud alpha functions add-iam-policy-binding predict --member=allUsers --role=roles/cloudfunctions.invoker
