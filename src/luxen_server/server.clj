(ns luxen-server.server
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.string]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.util.response :refer :all]
            [cheshire.core :refer :all])
  (:use luxen-server.luxen-data)
  (:import (java.time LocalDateTime)))

(def server-start-time (str (LocalDateTime/now)))

(defn json-response [data]
  (content-type {:body (generate-string data)} "application/json"))

;todo: add proper exception handling to avoid random http errors
(defroutes luxen-routes
           (GET "/api/docs" [] "Api docs")
           (GET "/api/start-time" [] server-start-time)
           (GET "/api/time-now" [] (str (LocalDateTime/now)))

           (GET "/issue/:project-id/:issue-id" [project-id issue-id]
             (json-response (get-issue project-id issue-id)))
           (GET "/issue/:issue-id" [issue-id]
             (json-response (get-issue issue-id)))
           )

(def luxen-server-config (wrap-defaults luxen-routes site-defaults))