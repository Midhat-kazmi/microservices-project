# Microservices Blog Platform

Event-driven blog app built with independent microservices.

## Services
- **client**: React frontend
- **posts**: creates posts
- **comments**: creates comments
- **moderation**: approves or rejects comments
- **query**: read-optimized view of posts and comments
- **event-bus**: routes events between services

## Tech Stack
Node.js, Express, React, Docker, Kubernetes, Skaffold, ingress-nginx

## Run
Requires Docker Desktop with Kubernetes, skaffold and ingress-nginx.
1. Add `127.0.0.1 posts.com` to your hosts file
2. Run `skaffold dev` from the project root
3. Open http://posts.com
