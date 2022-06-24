
docker login --username $HEROKU_DOCKER_USERNAME --password $HEROKU_API_KEY registry.heroku.com
docker-compose up
docker tag clean-node-api-v registry.heroku.com/clean-node-api-v
heroku container:push -a clean-node-api-v web
heroku container:release -a clean-node-api-v web
