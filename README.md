# mission-control 

[![Join the chat at https://gitter.im/orbitable/mission-control](https://badges.gitter.im/orbitable/mission-control.svg)](https://gitter.im/orbitable/mission-control?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> A web application orchestrating n-body simulations

A web application that provides access to n-body simulations.

![Mission
Control](https://upload.wikimedia.org/wikipedia/commons/f/fd/STS-128_MCC_space_station_flight_control_room.jpg)

## Usage Instructions

Given you have a properly configured node environment installed you can start
the application by install the required dependencies:

```
npm install 
npm install -g gulp
```

For local development you can use the Gulp develop task which watches for JS
changes and restarts th debug mode of TotalJS. 

```
gulp develop
```

This connects to the debug MongoDB instance that is hosted at
`mongodb://mongodb.orbitable.tech`. You can update the
`configs/mission-control-debug` settings or update the following environment
variables to change this:

```
MONGO_HOST=url.to.mongo-instance.com
MONGO_USER=your_user
MONGO_PASSWORD=secret_squirrle
MONGO_DATABASE=yourdatabase
```

## Tests

The totalJS test framework can be executed with:

```
gulp test
```
