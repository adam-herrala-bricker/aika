# Aika

- Browser app (early testing): https://nastytoboggan.com/app

> [!NOTE]
> Aika is currently under development. The test version demonstrates basic features as a proof-of-concept. However, data added to the test version is not persisted.

## About

Aika is a multi-modal, temporal slicing app. It is designed for applications where long-term storage, data privacy, and fine-grained access controls are a priority.

### What's under the hood?
- Frontend: React
  - Redux
  - RTK Query
  - Bundlers: ESbuild (email confirmation mini-app), Webpack (everything else)
- Backend: NodeJS
  - Express
  - Testing: Jest
- Database: PostgreSQL
  - Development + Testing: Containerized via the [Official Postgres Docker Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
  - Production: Postgres on Ubuntu
- Production Server: Ubuntu Server
  - Nginx
  - PM2
- DNS: Cloudflare 

### When might you want to use Aika?
- Your data is associated with a moment in time (short text, photos, videos, audio, the weather, a location, etc.).
- You want to tightly control who can view your data, typically only yourself or a small group of people. 
- You don't want your data to be visible to third-parties, tracked for targeted advertising, or otherwise commodified. 
- You want to control read, write, and delete permissions in unusual ways.
- You want to ensure the long-term availability of your data.

### When might you want to use something else?
- You want your data to be publicly visible or otherwise available to large groups (as in social media).
- You need to store complex, structured, or specialized data (as in GitHub).
- Strict temporal sequencing and temporal integrity are not priorities (as in a cloud storage service).

### What are a few examples of when Aika might be useful?
- Capturing big (and small) moments over the course of a childhood.
- Documenting discrete events in long-term projects.
- Tracking complex, time sensitive operations.
