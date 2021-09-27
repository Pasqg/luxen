(ns luxen-server.server
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.string]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]])
  (:import (java.time LocalDateTime)))

(def server-start-time (str (LocalDateTime/now)))

(defroutes luxen-routes
           (GET "/api/docs" [] "Api docs")
           (GET "/api/start-time" [] server-start-time)
           (GET "/api/time-now" [] (str (LocalDateTime/now)))
           )

(def luxen-server-config (wrap-defaults luxen-routes site-defaults))