# Luxen 🌞

Luxen is an issue tracking and project management software built in my
spare time as a fun personal project to play around with Clojure/React and
anything else.

## Building the project 🛠

Requirements:

* [Leiningen][] 2.0.0 or above installed.

[leiningen]: https://github.com/technomancy/leiningen

* A working `node` installation


* `npm` package manager (or equivalent) to build and run the webgui.


* MySQL

## Running Luxen

### MySQL

Before running Luxen server, you will need to start a MySql instance.

For example with docker, using default image from MySql:

    docker run --name mysql-luxen -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<rootpassword> -d mysql:latest

Set it up with:

    CREATE DATABASE <db_name>;
    USE <db_name>;
    CREATE TABLE issues (
        id INT NOT NULL,
        project_id VARCHAR(8) NOT NULL,
        title VARCHAR(96) DEFAULT 'New issue',
        description TEXT DEFAULT (''),
        status VARCHAR(16) DEFAULT 'Open');

### Luxen server

To start the web server for the application for development, simply run using server_runner.clj as entrypoint (main).

Alternatively run:

    lein ring server

The server will look for 'server.conf' file which should contain the following:

    logger-level ROOT INFO
    luxen-server-port <http-server-port>
    mysql-host <host>
    mysql-port <myseql-port>
    mysql-database <d_name>
    mysql-user <user>
    mysql-password <password>


### Luxen web gui

To start the web gui in development mode:

    cd webgui
    npm start

Then it will be accessible at

    localhost:3000

## License

This project is licensed under [Apache License, Version 2.0](LICENSE)

<p align="right">(<a href="#readme-top">back to top</a>)</p>