# GENAI Citation: Used to create and specify Dockerfile to language.
FROM swift:5.7

RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libsqlite3-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /sandbox

CMD ["swift", "/sandbox/script.txt"]
