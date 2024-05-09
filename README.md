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


* MySQL with:

    * "luxen_db" database
    * "issues" table

## Running Luxen

### MySQL

Before running Luxen server, you will need to start a MySql instance.

For example with docker, using default image from MySql:

    docker run --name mysql-luxen -p 3306:3306 -e MYSQL_ROOT_PASSWORD=luxenpassword -d mysql:latest

### Luxen server

To start the web server for the application for development, simply run
server_runner.clj with intellij runner configuration.

Alternatively run:

    lein ring server

### Luxen web gui

To start the web gui in development mode:

    cd webgui
    npm start

Then it will be accessible at

    localhost:3000

## License

This project is licensed under [Apache License, Version 2.0](LICENSE)

<p align="right">(<a href="#readme-top">back to top</a>)</p>