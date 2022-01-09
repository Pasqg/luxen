(ns luxen-server.server-runner
  (:require [ring.adapter.jetty :refer [run-jetty]])
  (:require [clojure.tools.logging :as logger])
  (:use luxen-server.server)
  (:use luxen-config.config)
  )

(read-config "server.conf")
(logger/info "Luxen server started")
(ring.adapter.jetty/run-jetty luxen-server-config {:port 5003})