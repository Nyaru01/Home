#!/bin/sh
# Construction du frontend
cd frontend
npm install
npm run build
cd ../backend

# Lancement du backend
npm install
npm start
