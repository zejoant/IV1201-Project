#!/bin/bash

#TO RUN THIS CODE MAKE SURE YOU DOWNLOAD WSL 
#WSL --INSTALL IN POWERSHELL WITH ADMIN PRIV
#THEN DOWNLOAD ZIP 
#SUDO APT UPDATE
#SUDO APT INSTALL ZIP -Y
#RUN WITH ./deploy.sh IN A WSL ENVIRONMENT LIKE UBUNTU OR WSL
#THIS WILL REDEPLOY THE AZURE WEB APP WITHOUT HAVING TO 
#MANUALLY COPY AND PASTE THE FILES 
#VERY NICE :)))


echo "1. Build React frontend..."
cd frontend || exit
npm install
npm run build || exit

echo "2. Copy React build to backend public folder..."
cd ..
rm -rf backend/public/*
cp -r frontend/build/* backend/public/

echo "3. Zip backend folder..."
cd backend || exit
zip -r ../app.zip ./* -x "node_modules/*"

echo "4. Fix backslashes in zip file..."
cd ..
unzip -o -q app.zip -d temp_extract
cd temp_extract
zip -r ../app_fixed.zip ./* -x "node_modules/*"
cd ..
rm -rf temp_extract
mv app_fixed.zip app.zip

echo "5. Deploy to Azure..."
az webapp deploy --resource-group Iv1201-test_group --name Iv1201-test --src-path app.zip --type zip
echo "Deployment finished!"