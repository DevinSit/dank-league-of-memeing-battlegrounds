#!/bin/sh

# Create service account.
gcloud iam service-accounts create workflows-service-account

gcloud projects add-iam-policy-binding serverless-hackathon-devin \
    --member serviceAccount:workflows-service-account@serverless-hackathon-devin.iam.gserviceaccount.com \
    --role roles/workflows.invoker

# Create scheduler job.
gcloud scheduler jobs create http execute-scrapePostsWorkflows \
    --schedule="0 4 * * * " \
    --location="us-east1" \
    --uri="https://workflowexecutions.googleapis.com/v1/projects/serverless-hackathon-devin/locations/us-central1/workflows/scrapePostsWorkflow/executions" \
    --time-zone="America/Toronto" \
    --oauth-service-account-email="workflows-service-account@serverless-hackathon-devin.iam.gserviceaccount.com"
