# Dank Meme Classifier

> For when you want to check if your memes are dank before sharing them!

![Screenshot](docs/images/DankMemeClassifier.png?raw=true)

The Dank Meme Classifier is a small **React** web app that uses **machine learning** to (intuitively enough) classify memes as either dank or not dank.

The Dank Meme Classifier can be accessed [here](https://dankmemeclassifier.com).

## Table of Contents

* [Why did I build the Dank Meme Classifier?](#why-did-i-build-the-dank-meme-classifier-)
  + [But, wait, then why does the demo at dankmemeclassifier.com only show one score?](#but--wait--then-why-does-the-demo-at-dankmemeclassifiercom-only-show-one-score-)
* [Repo Structure](#repo-structure)
* [Original Architecture and Tech Stack](#original-architecture-and-tech-stack)
  + [Post Scraper](#post-scraper)
  + [Post/Image Ingestion Pipeline](#post-image-ingestion-pipeline)
  + [Dank Predictions Pipeline](#dank-predictions-pipeline)
  + [User Facing Web App](#user-facing-web-app)
  + [Posts Querying API](#posts-querying-api)
  + [Data Storage](#data-storage)
  + [Model Training](#model-training)
* [Demo Architecture and Tech Stack](#demo-architecture-and-tech-stack)
  + [CI/CD Pipeline](#ci-cd-pipeline)
* [Local Development](#local-development)
  + [Web App Development Prerequisites](#web-app-development-prerequisites)
  + [Bringing up the App](#bringing-up-the-app)
* [Contributing](#contributing)
* [Authors](#authors)
* [License](#license)

## Why did I build the Dank Meme Classifier?

The Dank Meme Classifier was originally built as a project for an _Intro to AI_ course that I took in university. 

The original goal of the project was simply to see if I could build a machine learning model that could take an image (i.e. a meme) as input and output a **dankness score** or **dankness likelihood**. 

Due to the requirements of the project for the course, I also decided to do a comparison between a model that I would build (more-or-less by hand) and a model automatically generated by the **Google Cloud Platform** (GCP) **AutoML Vision** service (a service where all you do is upload a folder with a bunch of categorized images and it trains a model on them automagically). 

Obviously, since I'm no expert data scientist, I didn't really expect to be able to build a model that could compete with **AutoML** (or that any model at all would be able to predict **dankness likelihood**). However, I was able to build a **Convolutional Neural Network** model with **Keras** that came within a handful of percent of the **AutoML** model.

Now whether or not _either_ model was particularly accurate is still up for debate (both models had accuracy values in the high 50 percents), but considering the domain that we're working with here (_dank memes_), I settled with the fact that any particular meme is probably a coin-toss for dankness regardless. 

As such, I took what I got and ran with it. I built a web app to wrap the two models and so that two dankness likelihoods could be provided: one for each model. 

On top of allowing people to upload and classify their own images, I also setup a pipeline to ingest the latest memes from the `r/dankmemes` subreddit and display dankness likelihoods for those too.

### But, wait, then why does the demo at dankmemeclassifier.com only show one score?

The demo that is running at [dankmemeclassifier.com](https://dankmemeclassifier.com) is a pared-down version of the original project. 

Since I wanted everything to run on GCP **Cloud Run** to keep costs down, I decided to cut out the **AutoML** model. I also cut out the `r/dankmemes` image ingestion since that also required extra infrastructure that I didn't want running just for this demo.

But you can still upload your own images and see if they're dank enough to be shared!

## Repo Structure

```
├── docs/                   # Miscellaneous docs and images
├── ingestionPipeline/		# The pipeline for ingesting posts/images from the 'postScraper' into Datastore/Cloud Storage
├── modelBuilding/			# The notebook for building the Dank Meme Classifier model
├── postScraper/			# The cron job that periodically scrapes Reddit for the latest 'r/dankmemes' posts and feeds them to the ingestion pipeline
├── predictionPipeline/		# Sits behind a PubSub topic and handles forwarding the scraped images to the Keras/AutoML models for dankness predictions
└── webApp/					# The user facing web app (Frontend) and Backend that handles the Keras model
```

## Original Architecture and Tech Stack

The architecture of the full version of the Dank Meme Classifier can be roughly described using the following diagram:

![Architecture](docs/images/DankMemeClassifier_Architecture.png?raw=true)

There are several components at play here.

### Post Scraper

> **Folder**: `postScraper`
>
> **Language**: JavaScript
>
> **Infrastructure**: Cloud Function, App Engine Cron Scheduler

The _Post Scraper_ was a GCP **Cloud Function** that was scheduled to fire on a regular basis by the **App Engine** cron service (note that this project was implemented in late 2018 -- before the introduction of the **Cloud Scheduler** service).

The **Cloud Function** would then scrape the `r/dankmemes` subreddit for the latest set of posts, and send the information (including post title, author, and the URL to the meme) off to the _Post/Image Ingestion Pipeline_.

### Post/Image Ingestion Pipeline

> **Folder**: `ingestionPipeline`
>
> **Language**: JavaScript
>
> **Infrastructure**: Cloud Function, PubSub

This ingestion pipeline starts as another **Cloud Function** that would receive the post information from the _Post Scraper_. It would then take the list of posts and chunk it up into smaller lists before feeding each smaller list to a **PubSub** topic.

The **PubSub** topic would then publish each smaller list to another **Cloud Function**. Each list would be given to an individual instance of the **Cloud Function** so that they could all be processed in parallel. The **Cloud Function** would fetch the images, process them, and then store them into a **Cloud Storage** bucket (as well as storing the post metadata into **Datastore**).

The reason to do all of this was scalability. Although the _Post Scraper_ service only scraped a small number of posts during its scheduled runs, it was originally used to gather all of the _30,000_ odd images that were used to train the **Keras** model. 

As such, having the whole image ingestion pipeline run entirely in parallel sped up the process to the point of taking just a handful of minutes for all those images.

### Dank Predictions Pipeline

> **Folder**: `predictionPipeline`
>
> **Language**: JavaScript
>
> **Infrastructure:** Cloud Function, PubSub, AutoML Vision

Once the images had been ingested, another **PubSube** topic would be notified that the images were ready for dankness predictions. The topic would notify two other **Cloud Functions**: one for my home-grown **Keras** model, and one for the **AutoML** model.

These **Cloud Functions**, however, merely acted as proxies for the actual prediction services. The _Keras Predictions_ service ran as part of the web app's _Backend_ service on a **Kubernetes** (GKE) cluster, whereas the _AutoML Predictions_ service was **GCP** managed.

Once the predictions had been made, these too were saved to **Datastore**. Note that throughout all of this, the hash of each image was used for identification. This way, even if the same image was ingested multiple times, as long it hashed the same, then it wouldn't be processed/stored multiple times.

### User Facing Web App

> **Folder**: `webApp/frontend`
>
> **Language**: JavaScript
>
> **Framework**: React
>
> **Infrastructure**: Docker container hosted on Kubernetes

Once a user finally wanted to interact with the app, this is what they'd be dealing with. This was a **React** service hosted as a container on a **Kubernetes** cluster.

The _Frontend_ handled calling out to the _Posts Querying API_ (aka the _Backend_ -- see below) to grab the predictions for the latest set of `r/dankmemes` posts. Additionally, it also enabled users to upload their own images to predict for dankness.

### Posts Querying API

> **Folder**: `webApp/backend`
>
> **Language**: Python
>
> **Framework**: Flask, Keras
>
> **Infrastructure**: Docker container hosted on Kubernetes

The last piece of the puzzle, this service acted as a middleware between the _Frontend_ (aka the _User Facing Web App_) and the data stored in **Datastore**/**Cloud Storage**. It handled requests from the _Frontend_ to look up the latest posts and URLs to the memes.

The _Posts Querying API_ was actually only half of the _Backend_ service; the other half was (as noted earlier) the _Keras Predictions_ service. Yes, this one **Flask** API handles both duties!

From a scalability and microservices perspective, it probably would have been better to split these two duties apart, but it was simpler and easier to keep them together since they both needed to share code. Also, raw performance wasn't exactly a problem here.

### Data Storage

There were three main storage solutions that were used for this app:

1. **Datastore**: A simple NoSQL database that handled storing Reddit post metadata, image URLs, and prediction values.
2. **Images Bucket**: A **Cloud Storage** bucket that stored the processed images from the _Ingestion Pipeline_ that would be predicted upon in the _Dank Predictions Pipeline_.
3. **Model Bucket**: A **Cloud Storage** bucket that stored the finished **Keras** models. The models would then get replicated from the bucket to an NFS share on the **Kubernetes** cluster for use by the _Keras Predictions_ service.

### Model Training

Model training was done using **Google Colab**, a hosted **Jupyter** solution with access to (free!) Titan K80 GPUs for training. 

Training consisted of using a set of 30,000 images that were pulled from the `r/dankmemes` subreddit. The methodology I used was as follows: using a set of the most and least upvoted posts on the subreddit, I would classify each image as **dank** if it was highly-upvoted and 'not-dank' if it was barely upvoted at all. 

That is, I would use the post's Reddit score as a proxy for whether or not a meme was **dank**. Intuitively, this would make sense since people in the subreddit called _dankmemes_ should theoretically upvote the memes that are the most dank. Obviously, this unlike to be true 100% of the time, but it seemed like a good enough approximation given the domain.

Once I had my set of images all split up into **dank** and **not-dank**, I then split it once again into the training and validation (or test) sets. The training set would end up being 80% of the total image set -- 24,000 images -- while the test set would be 6,000 images.

Finally, it then just became a process of figuring out how to actually train a machine learning model. I eventually learned that it would be easiest (i.e. least time-consuming) to do transfer learning on an existing **Convolutional Neural Network** architecture than try and piece together a network from scratch (or from a whitepaper).

As such, I took one of **Keras'** built-in models -- the **VGG16** -- and lopped off its final fully-connected layer before trying many, many different combinations of other layers. 

In the end, I was able to produce a model with a validation accuracy of roughly 57%; not much better than a coin toss, but _still better than a coin toss_. Considering the automagically-generated **AutoML** model that I was competing against was at around 60%, I felt pretty good.

Obviously, the process I went through for building and validating the model was far from rigorous, but hey, for a non-data-scientist, it sure looked pretty good! And it seemed to get a couple of chuckles out of people too :smiley:

The Jupyter notebook that was used to generate the final **Keras** model can be found in the `modelBuilding` folder.

## Demo Architecture and Tech Stack

The demo version of the Dank Meme Classifier (what is currently available at [dankmemeclassifier.com](https://dankmemeclassifier.com)) simplifies the above by quite a bit. 

It consists of just the _Frontend_ and _Backend_ services that make up the web app (found in the `webApp` folder).

The _Frontend_ (i.e. the _User Facing Web App_) is basically the same as in the original architecture, but the _Backend_ only makes use of the _Keras Predictions_ service for doing direct (synchronous) predictions straight from the web app, instead of having to go through the image ingestion pipeline.

Additionally, instead of running on a **Kubernetes** cluster, these two services run independently on GCP **Cloud Run** -- for cost-saving purposes.

### CI/CD Pipeline

There's two pipelines here; one each for the _Frontend_ and _Backend_ service.

Since I'm using **GCP** for hosting, making use of their **Cloud Build** service only makes sense. As such, the configuration for the each pipeline can be found in the `cloudbuild.*.yaml` files under the `webApp` folder.

Currently, the pipelines are only really setup for the 'CD' half, since I haven't bothered setting up linting or testing for this demo yet.

Pushing commits to the `master` branch will trigger builds depending on which files were changed.

## Local Development

The following is a guide on how to bring up the pieces of the application for development.

### Web App Development Prerequisites

Of the various components that make up the Dank Meme Classifier, only the web app portion is really suitable for running locally. To do so, you must have already installed the following:

- `docker`
- `docker-compose`
- `make`

### Bringing up the App

To start both the _Frontend_ and _Backend_ services together, make sure you're in the `webApp` folder and run:

```
make start
```

Once that's finished starting, you can visit the _Frontend_ at [localhost:3000](http://localhost:3000).

## Contributing

Since this project is just a demo, it is not open for contributions. But feel free to fork it and make it your own!

## Authors

- **Devin Sit**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
