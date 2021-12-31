#!/bin/sh

echo "${NODE_ENV}"

if [ "${NODE_ENV}" = "development" ]; then
    echo "Running development build";

    # Use exec so that the NPM command receives all signals,
    # so that the container actually stops properly when signalled to.
    # (e.g. when killing docker-compose)
    # For reference: https://blog.true-kubernetes.com/why-does-my-docker-container-take-10-seconds-to-stop/
    exec npm start;
else
    echo "Running production build";
    exec npm run start:prod;
fi
