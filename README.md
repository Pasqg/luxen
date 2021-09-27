# luxen-server

This is the web server for Luxen issue tracking and project management software. 

## Prerequisites

You will need [Leiningen][] 2.0.0 or above installed.

[leiningen]: https://github.com/technomancy/leiningen

You will also need a browser to access the web gui and a MySql instance.

## Configuration

Before running Luxen server, you will need to start a MySql instance.

For example with docker, using default image from mysql website:

    docker run --name mysql-luxen -p 3306:3306 -e MYSQL_ROOT_PASSWORD=luxenpassword -d mysql:latest

Luxen will need the following:
* "luxen_db" database
* "issues" table

## Running

To start the web server for the application for development, simply run server_runner.clj with intellij runner configuration.

Another alternative is to run:

    lein ring server

## License

This project is licensed under [Apache License, Version 2.0](LICENSE)
