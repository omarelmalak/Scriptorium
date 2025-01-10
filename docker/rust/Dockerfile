# GENAI Citation: Used to create and specify Dockerfile to language.

FROM rust:1.67-slim

RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /sandbox

CMD ["tail", "-f", "/dev/null"]
