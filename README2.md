# 🍔 FizzBurger API - Docker Setup Guide

## 🛠️ Setup Instructions

### 1. First-Time Setup

```bash
# 1. Login to Serverless (required for v4+)
npx serverless login
```

```bash
# 2. Create environment file
cp .env.example .env
```

### 2. Edit the .env file with the following configuration:

```bash
MONGODB_URI=mongodb://mongo:27017
```

## Starting the Application

To build and start all services:

```bash
docker-compose up --build
```
