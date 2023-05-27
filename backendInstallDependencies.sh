#!/bin/bash
echo "Switching to backend src folder"
cd '../../backend/Kuarxis-Web-App/amplify/backend/function/kuarxbedevFunction/src'
echo "Installing dependencies with npm install"
npm install
echo "Switching back to the frontend folder"
cd '../../../../../../../frontend/Kuarxis-Web-App/frontend/src'
echo "Backend dependencies installation complete."