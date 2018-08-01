# Prerender Docker Container

A prebuilt docker image that clones the prerender github repo and installs phantomjs prerender server.

## Run Docker Image

```bash
docker run -it -p 8080:3000 bowtiebrandon/prerender-docker
```

Connect to `localhost:8080/(http|https)://<website-address>` to prerender any website provided i.e. `localhost:8080/https://www.google.com`

## Environment Variables For AWS

Make sure to export `ALLOWED_DOMAINS` and `S3_BUCKET_NAME` specific to your app. `ALLOWED_DOMAINS` causes prerender to only allow requests made to a certain domain, so if `ALLOWED_DOMAINS` is set to `www.google.com`, no other domains can be processed by prerender.
```bash
export ALLOWED_DOMAINS=www.google.com,google.com
export S3_BUCKET_NAME=prerender-cache-bucket
```