(defproject luxen-server "0.1.0-SNAPSHOT"
  :description "Luxen is a issue tracking and project management software."
  :url "http://example.com/FIXME"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [compojure "1.6.1"]
                 [ring/ring-defaults "0.3.2"]
                 [ring-cors/ring-cors "0.1.13"]
                 [ring/ring-jetty-adapter "1.3.1"]
                 [org.clojure/java.jdbc "0.7.12"]
                 [mysql/mysql-connector-java "5.1.49"]
                 [cheshire "5.10.0"]
                 [org.clojure/tools.logging "1.2.4"]
                 [org.slf4j/slf4j-api "1.7.32"]
                 [ch.qos.logback/logback-classic "1.2.10"]
                 ]
  :plugins [[lein-ring "0.12.5"]]
  :ring {:handler luxen-server.server/luxen-server-config}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring/ring-mock "0.3.2"]]}})
