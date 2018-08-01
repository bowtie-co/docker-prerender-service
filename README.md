# Prerender Docker Container

A prebuilt docker image that clones the prerender github repo and installs phantomjs prerender server.

## Run Docker Image

```bash
docker run -it -p 8080:3000 bowtiebrandon/prerender-docker
```

Connect to `localhost:8080/(http|https)://<website-address>` to prerender any website provided i.e. `localhost:8080/https://www.google.com`