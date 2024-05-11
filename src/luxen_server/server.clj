(ns luxen-server.server
  (:require [compojure.core :refer :all]
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
(defn luxen-routes [db]
  (defroutes luxen-routes
             (GET "/api/docs" [] "Api docs")
             (GET "/api/start-time" [] server-start-time)
             (GET "/api/time-now" [] (str (LocalDateTime/now)))

             (GET "/issue/:project-id/:issue-id" [project-id issue-id]
               (json-response (get-issue project-id issue-id)))
             (GET "/issue/:issue-id" [issue-id]
               (json-response (get-issue db issue-id)))
             (GET "/issues/:project-id" [project-id]
               (json-response (get-issues-for-project db project-id)))
             (GET "/all-issues/:limit" [limit]
               (json-response (get-n-issues db limit)))
             (GET "/all-issues" []
               (json-response (get-n-issues db 1000)))
             (GET "/open-issues/:limit" [limit]
               (json-response (get-open-issues db limit)))
             (GET "/projects" []
               (json-response (get-projects db)))

             (GET "/project/create/:project-id" [project-id]
               (if (pos? (first (create-first-issue-for-project db project-id)))
                 (status-response "OK")
                 (status-response "ERROR")))
             (GET "/issue/create/:project-id/:title/:description" [project-id title description]
               (if (pos? (first (create-issue db project-id title description)))
                 (status-response "OK")
                 (status-response "ERROR")))
             (GET "/issue/setStatus/:project-id/:id/:status" [project-id id status]
               (if (pos? (first (set-issue-status db project-id id status)))
                 (status-response "OK")
                 (status-response "ERROR")))
             ))

(defn wrap-db-middleware [handler db]
  (fn [request]
    (handler (assoc request :db db))))

(defn luxen-server-config [db]
  (-> (luxen-routes db)
      (wrap-db-middleware db)
      (wrap-defaults site-defaults)
      (wrap-cors :access-control-allow-origin [#".*"]
                 :access-control-allow-methods [:get])))