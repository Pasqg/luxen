cd webgui || { echo "No 'webgui' folder found. Stopping the build!"; exit 1; }
echo "Building Luxen web gui..."
npm run build || { echo "Could not build Luxen web gui, check for previous errors. Stopping the build!"; exit 1; }
echo "Luxen web gui built successfully."
echo ""

cd ..
echo "Building Luxen server..."
lein uberjar || { echo "Could not build Luxen server, check for previous errors. Stopping the build!"; exit 1; }
echo "Luxen server built successfully."
echo ""

cd luxen-cli || { echo "Could not build Luxen cli, check for previous errors. Stopping the build!"; exit 1; }
echo "Building Luxen cli..."
./build-cli.sh
echo "Luxen cli built successfully."
echo ""
