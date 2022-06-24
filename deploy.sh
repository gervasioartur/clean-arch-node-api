
docker login --username $HEROKU_DOCKER_USERNAME --password $HEROKU_API_KEY registry.heroku.com
docker-compose up
heroku container:psuh -a clean-node-api-v web
heroku container:release -a clean-node-api-v web
