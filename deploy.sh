
docker tag clean-node-api-v registry.heroku.com/clean-node-api-v
docker login --username $HEROKU_DOCKER_USERNAME --password $HEROKU_API_KEY registry.heroku.com
docker-compose build
docker push registry.heroku.com/clean-node-api-v
heroku container:release web --app=clean-node-api-v 
