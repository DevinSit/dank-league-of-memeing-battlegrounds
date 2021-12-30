#!/bin/sh

gcloud functions deploy scrapePosts \
    --entry-point scrapePosts \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --env-vars-file .env \
    --timeout 300s \
    --memory 1024MB

gcloud functions deploy ingestPosts \
    --entry-point ingestPosts \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --env-vars-file .env \
    --timeout 300s \
    --memory 1024MB

gcloud functions deploy predict \
    --entry-point predict \
    --allow-unauthenticated \
    --trigger-http \
    --runtime nodejs14 \
    --env-vars-file .env \
    --timeout 300s \
    --memory 1024MB
