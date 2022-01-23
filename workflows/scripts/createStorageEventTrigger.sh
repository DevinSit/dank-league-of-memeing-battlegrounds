#!/bin/sh

# Configure permissions for Cloud Storage and Pub/Sub.
gcloud projects add-iam-policy-binding serverless-hackathon-devin \
    --member serviceAccount:service-602308134174@gs-project-accounts.iam.gserviceaccount.com \
    --role roles/pubsub.publisher

gcloud projects add-iam-policy-binding serverless-hackathon-devin \
    --member serviceAccount:service-602308134174@gcp-sa-pubsub.iam.gserviceaccount.com \
    --role roles/iam.serviceAccountTokenCreator

# Create the Cloud Storage event trigger.
#
# FYI, the trigger is called `storage-trigger-ingest-image-workflow` rather than
# `storage-trigger-ingestImageWorkflow` because — for some stupid reason — uppercase
# letters aren't allowed in trigger names! You literally get an error for it!
gcloud eventarc triggers create storage-trigger-ingest-image-workflow \
    --location=us-east1 \
    --destination-workflow=ingestImageWorkflow \
    --destination-workflow-location=us-central1 \
    --event-filters="type=google.cloud.storage.object.v1.finalized" \
    --event-filters="bucket=easy-dank-meme-classifier-staging-images" \
    --service-account=workflows-service-account@serverless-hackathon-devin.iam.gserviceaccount.com
