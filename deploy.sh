
docker login --username $HEROKU_DOCKER_USERNAME --password $HEROKU_API_KEY registry.heroku.com
docker build  -t clean-node-api -f ./Dockerfile .
docker tag clean-node-api registry.heroku.com/clean-node-api-v/web
docker push registry.heroku.com/clean-node-api-v/web
heroku container:release -a clean-node-api web
