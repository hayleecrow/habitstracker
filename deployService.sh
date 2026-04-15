while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying Service bundle $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build # remove old build file if it exists
mkdir build # create a new build file to hold the distribution package
npm install # installs frontend dependencies to make sure vite is installed so that we can bundle
npm run build # build the React frontend using vite
cp -rf dist build/public # copies the React frontend to the target distribution (build/public)
cp service/*.js build # copies the backend service to the target distribution (build)
cp service/*.json build

# Step 2
# Note: Could create backup for last distribution package with mv services/${service} services/${service}.backup before the rm command
printf "\n----> Clearing out previous distribution (i.e. deployment) on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH # ssh into the server to delete the old distribution package (i.e. startup) and create a new one
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3
printf "\n----> Copy the distribution package (build) to the target (startup server)\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4
printf "\n----> Deploy the service on the target\n"
# ssh into the server -> cd into the service directory -> install dependencies -> restart the service with pm2
ssh -i "$key" ubuntu@$hostname << ENDSSH
bash -i
cd services/${service}
npm install
pm2 restart ${service}
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n" # it saves space to remove the local copy of the distribution package (build) after deployment
rm -rf build
rm -rf dist