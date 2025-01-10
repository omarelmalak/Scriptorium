# GENAI Citation: Used to create and specify Dockerfile to language.

FROM openjdk:17-slim

RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    bash \
    && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-c"]

RUN curl -s https://get.sdkman.io | bash \
    && bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install kotlin"

ENV PATH="/root/.sdkman/candidates/kotlin/current/bin:${PATH}"

WORKDIR /sandbox

CMD ["tail", "-f", "/dev/null"]
