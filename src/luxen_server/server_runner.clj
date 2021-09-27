(ns luxen-server.server-runner
  (:require [ring.adapter.jetty :refer [run-jetty]])
  (:use luxen-server.server)
  )

(println "Luxen server started")
(ring.adapter.jetty/run-jetty luxen-server-config {:port 5003})