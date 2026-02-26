# Job Application Platform

This project is a full-stack web application for managing job applications, with separate interfaces for applicants and recruiters.

It consists of:
- A **Node.js / Express backend**
- A **React frontend**
- A **PostgreSQL database (Azure)**
- Deployment via **Azure Web App**

## Tech Stack
### Backend
- Node.js
- Express 4
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- dotenv

### Frontend
- React
- React Router
- Create React App

### Deployment
- Azure Web App
- Azure PostgreSQL
- Bash deployment script (WSL)

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18+ recommended)
- npm
- PostgreSQL
- Azure CLI (`az`)
- Windows Subsystem for Linux (WSL) for deployment
- Git

### Install dependencies
`npm install`

### Create Environment Variables
A `.env` file is needed in the backend containing the following

```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-password
DB_NAME=your-database-name
DB_PORT=5432
DB_SSL=true
JWT_SECRET=your-secret-key
```
## Running & Deploying

- To run the frontend do: `npm start`
- To run the backend do: `node server.js`
- To deploy the app to azure, run `deploy.sh`
