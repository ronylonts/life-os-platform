# ──────────────────────────────────────────────────────────────
# Image de base : Ubuntu avec Java 21
# ──────────────────────────────────────────────────────────────
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# ──────────────────────────────────────────────────────────────
# 1. Outils système de base
# ──────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y \
  curl \
  wget \
  unzip \
  git \
  openjdk-21-jdk \
  && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# ──────────────────────────────────────────────────────────────
# 2. Node.js 22
# ──────────────────────────────────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# ──────────────────────────────────────────────────────────────
# 3. Android SDK Command Line Tools
# ──────────────────────────────────────────────────────────────
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
  -O /tmp/cmdline-tools.zip && \
  unzip -q /tmp/cmdline-tools.zip -d /tmp && \
  mv /tmp/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
  rm /tmp/cmdline-tools.zip

RUN yes | sdkmanager --licenses && \
  sdkmanager \
  "platform-tools" \
  "platforms;android-34" \
  "platforms;android-36" \
  "build-tools;34.0.0" \
  "build-tools;35.0.0"

# ──────────────────────────────────────────────────────────────
# 4. Répertoire de travail
# ──────────────────────────────────────────────────────────────
WORKDIR /workspace

# ──────────────────────────────────────────────────────────────
# 5. Script d'entrée
# ──────────────────────────────────────────────────────────────
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
