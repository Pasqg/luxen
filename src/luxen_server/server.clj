(ns luxen-server.server
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [clojure.string]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.middleware.cors :refer [wrap-cors]]
            [ring.util.response :refer :all]
            [cheshire.core :refer :all])
  (:use luxen-server.luxen-data)
  (:import (java.time LocalDateTime)))

(def server-start-time (str (LocalDateTime/now)))

(defn json-response [data]
  (content-type {:body (generate-string data)} "application/json"))

(defn status-response [status] (json-response {:status status}))

;todo: add proper exception handling to avoid random http errors
(defroutes luxen-routes
           (GET "/api/docs" [] "Api docs")
           (GET "/api/start-time" [] server-start-time)
           (GET "/api/time-now" [] (str (LocalDateTime/now)))

           (GET "/issue/:project-id/:issue-id" [project-id issue-id]
             (json-response (get-issue project-id issue-id)))
           (GET "/issue/:issue-id" [issue-id]
             (json-response (get-issue issue-id)))
           (GET "/issues/:project-id" [project-id]
             (json-response (get-issues-for-project project-id)))

           (GET "/project/create/:project-id" [project-id]
             (if (pos? (first (create-first-issue-for-project project-id)))
               (status-response "OK")
               (status-response "ERROR")))
           (GET "/issue/create/:project-id/:title/:description" [project-id title description]
             (if (pos? (first (create-issue project-id title description)))
               (status-response "OK")
               (status-response "ERROR")))
           )

(def luxen-server-config (-> luxen-routes
                             (wrap-defaults site-defaults)
                             (wrap-cors :access-control-allow-origin [#".*"]
                                        :access-control-allow-methods [:get])))