(defproject luxen-server "0.1.0-SNAPSHOT"
  :description "Luxen is a issue tracking and project management software."
  :url "http://example.com/FIXME"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [compojure "1.6.1"]
                 [ring/ring-defaults "0.3.2"]
                 [ring/ring-jetty-adapter "1.3.1"]
                 [org.clojure/java.jdbc "0.7.12"]
                 [mysql/mysql-connector-java "5.1.49"]
                 [cheshire "5.10.0"]
                 ]
  :plugins [[lein-ring "0.12.5"]]
  :ring {:handler luxen-server.server/luxen-server-config}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring/ring-mock "0.3.2"]]}})
