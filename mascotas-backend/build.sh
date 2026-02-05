#!/bin/bash
set -e

echo "==> Installing Maven..."
apt-get update
apt-get install -y maven

echo "==> Building with Maven..."
mvn clean package -DskipTests

echo "==> Build complete!"
