# Dank League of Memeing Battlegrounds

<p align="center">
    <img src="https://github.com/DevinSit/dank-league-of-memeing-battlegrounds/blob/master/docs/images/DankLeagueOfMemeingBattlegrounds.png?raw=true" />
</p>

From the creator the [Dank Meme Classifier](https://github.com/DevinSit/dank-meme-classifier.git) and the award-winning [The Buzzword Bingo](https://github.com/DevinSit/the-buzzword-bingo.git) comes a brand new entry in the Dank Memes saga. Introducing the [Dank League of Memeing Battlegrounds](https://dankleagueofmemeingbattlegrounds.com)! Compete in this high stakes, high intensity thriller that is sure to be the next big eSport!

Perfect for filling idle time between meetings or — even better — _during_ meetings! Yes, why bother listening to your scrum master drone on when you can compete for the top of the leaderboard to answer the question:

Are _you_ a dank memer?

## Repo Structure

```
├── docs        # Miscellaneous docs and images
├── functions   # Cloud Functions that make up the various pipelines
├── webApp      # Cloud Run services for the API and Browser Client for the actual game.
└── workflows   # Cloud Workflows for configuring the various pipelines
```

## Architecture & Tech Stack

**Languages**: JavaScript, TypeScript, Python (+ some bash)

**Frameworks**: React/NextJS, Flask

**Infrastructure**: GCP Cloud Functions, Cloud Run, Cloud Workflows, Cloud Storage, Cloud Vision, Cloud Build, Cloud Scheduler, Eventarc, Datastore

The architecture of the Dank League of Memeing Battlegrounds can be described as follows:

![Architecture of the Dank League of Memeing Battlegrounds](/docs/images/DankLeagueOfMemeingBattlegrounds_Architecture.png?raw=true)

There are several components at play here.

### Workflow - scrapePosts

This Cloud Workflow (`workflows/scrapePostsWorkflow.yaml`) is made up of three Cloud Functions:

- `functions/src/scrapePosts.js`
- `functions/src/ingestPartialPosts.js`
- `functions/src/downloadPostImages.js`

This workflow is triggered by Cloud Scheduler every hour. It handles scraping the r/dankmemes subreddit for 5 of its freshest memes before ingesting them. Where "ingesting" means saving some of the post metadata to Datastore and downloading the meme image to the Staging Image Bucket. However, this is only the first half of ingestion...

### Workflow - ingestImage

This Cloud Workflow (`workflows/ingestImageWorkflow.yaml`) is made up of five Cloud Functions:

- `functions/src/filterExplicitImages.js`
- `functions/src/processImages.js`
- `functions/src/predict.js`
- `functions/src/updatePostHashes.js`
- `functions/src/deleteStagingImages.js`

This workflow is triggered by an Eventarc trigger that happens for every image that gets deposited into the Staging Image Bucket. As such, this workflow is parallelized to each image.

This workflow handles (in order) making sure it's a "Safe for Work" image using the Cloud Vision Safe Search API, processing the image (basically scaling it to the right size for the Dank Prediction ML model, hashing it, and then storing it in the Image Bucket), performing the actual dankness prediction (which is done by submitting the path to the image to the Backend), updating the image hashes on the related posts, and finally cleaning up the images from the Staging Image Bucket.

### Workflow - pruneUnavailablePosts

This Cloud Workflow (`workflows/pruneUnavailablePostsWorkflow.yaml`) has an inner (parallel) workflow (`workflows/pruneRunnerWorkflow.yaml`) and is made up of two Cloud Functions:

- `functions/src/fetchAvailablePosts.js`
- `functions/src/pruneUnavailablePosts.js`

This workflow is triggered by Cloud Scheduler every 12 hours. It handles pruning (i.e. removing) any posts whose source images have gone 404. This way we only serve the cleanest and freshest of the dank memes.

### Cloud Run - Web App

The web app (i.e. the actual game) is comprised of two Cloud Run services:

- `webApp/backend`
- `webApp/frontend`

The Frontend is a TypeScript/React/NextJS app that the user loads when connecting to [dankleagueofmemeingbattlegrounds.com](https://dankleagueofmemeingbattlegrounds.com). For all intents and purposes, it is "The Game" (btw, you lost the game).

The Backend is a Python/Flask API that acts as a middleware layer between the Frontend and the Datastore; it handles all of the fetching of posts, predictions, and scores from Datastore to feed the Frontend. 

Additionally, the Backend also houses our hand-crafted, artisan Dank Prediction ML model that handles the dankness predictions for the `predict` Cloud Function. Because of the model's size, it's more efficient to package it up in a Docker image for Cloud Run than to pull it down in a Cloud Function.

### CI/CD Pipelines

There are four Cloud Build pipelines:

- One that deploys all of the Cloud Workflows (`workflows/cloudbuild.yaml`)
- One that deploys all of the Cloud Functions (`functions/cloudbuild.yaml`)
- One that deploys the Frontend Cloud Run service of the Web App (`webApp/cloudbuild.frontend.yaml`)
- One that deploys the Backend Cloud Run service of the Web App (`webApp/cloudbuild.backend.yaml`)

Each pipeline is configured to deploy independently of the others, so that they only deploy if relevant file changes were made.

## Contributing

This project is not open for contributions. But feel free to fork it and make it your own!

## Authors

- **Devin Sit**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
