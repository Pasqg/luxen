(ns luxen-server.server-runner
  (:require [clojure.tools.logging :as logger]
            [clojure.tools.logging :as logger]
            [ring.adapter.jetty])
  (:use [luxen-config.config]
        [luxen-server.luxen-data]
        [luxen-server.server])
  (:import (ch.qos.logback.classic Level)
           (ch.qos.logback.classic Logger)
           (org.slf4j LoggerFactory))
  )

(defn configure-logging [levels]
  (let [logger-name ^String (first levels)
        level (second levels)]
    (.setLevel
      ^Logger (cast Logger (LoggerFactory/getLogger logger-name))
      (Level/valueOf level))
    (logger/info "Read logger level" level "for" logger-name)))

(let [config-map (read-config-file "server.conf")
      logger-config (:logger-level config-map)
      server-port (Integer/parseInt (:luxen-server-port config-map))
      db (create-db
           (:mysql-host config-map)
           (Integer/parseInt (:mysql-port config-map))
           (:mysql-user config-map)
           (:mysql-password config-map)
           (:mysql-database config-map))]
  (do (configure-logging logger-config)
      (logger/info "Luxen server started")
      (ring.adapter.jetty/run-jetty (luxen-server-config db) {:port server-port})))