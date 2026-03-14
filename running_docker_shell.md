# make helper executable
chmod +x docker.sh

# build images
./docker.sh build                 # build all services
./docker.sh build --no-cache client

# start/stop services
./docker.sh up                    # start all services (detached)
./docker.sh up client             # start only client
./docker.sh stop                  # stop all services
./docker.sh down                  # stop and remove containers/networks

# inspect & interact
./docker.sh logs client           # tail client logs
./docker.sh ps                    # show compose status
./docker.sh exec api bash         # open shell in api container