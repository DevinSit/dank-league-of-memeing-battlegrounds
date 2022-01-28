#!/bin/sh

# # Create service account.
# gcloud iam service-accounts create workflows-service-account

# gcloud projects add-iam-policy-binding serverless-hackathon-devin \
#     --member serviceAccount:workflows-service-account@serverless-hackathon-devin.iam.gserviceaccount.com \
#     --role roles/workflows.invoker

# Create scheduler job.
gcloud scheduler jobs create http execute-pruneUnavailablePostsWorkflow \
    --schedule="30 */12 * * *" \
    --location="us-east1" \
    --uri="https://workflowexecutions.googleapis.com/v1/projects/serverless-hackathon-devin/locations/us-east1/workflows/pruneUnavailablePostsWorkflow/executions" \
    --time-zone="America/Toronto" \
    --oauth-service-account-email="workflows-service-account@serverless-hackathon-devin.iam.gserviceaccount.com"
