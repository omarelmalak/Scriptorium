# GENAI Citation: Used to create and specify Dockerfile to language.

FROM node:18-slim

RUN npm install -g typescript

RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /sandbox

CMD ["tail", "-f", "/dev/null"]
