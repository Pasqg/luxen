(ns luxen-server.luxen-data
  (:require [clojure.java.jdbc :as jdbc]
            clojure.string
            [clojure.tools.logging :as logger]))

;todo: move to configuration file
(def mysql-host "localhost")
(def mysql-port "3306")
(def mysql-database "luxen_db")
(def mysql-user "root")
(def mysql-password "luxenpassword")

(def db {:classname   "com.mysql.jdbc.Driver"
         :subprotocol "mysql"
         :subname     (str "//" mysql-host ":" mysql-port "/" mysql-database)
         :user        mysql-user
         :password    mysql-password})

(defn get-issues-for-project [^String project-id]
  (jdbc/query db (str "select * from issues where project_id = '" project-id "' order by id desc")))

(defn get-n-issues [n]
  (jdbc/query db (str "select * from issues order by id desc limit " n)))

(defn get-open-issues [n]
  (jdbc/query db (str "select * from issues where status <> 'Done' order by id desc limit " n)))

(defn get-projects []
  (jdbc/query db (str "select distinct project_id from issues")))

(defn get-issue
  ([project-id issue-id]
   (jdbc/query db (str "select * from issues where id = " issue-id " and project_id = '" project-id "' order by id desc")))
  ([issue-id]
   (let [split (clojure.string/split issue-id #"-")]
     (get-issue (first split) (second split))))
  )

(defn create-issue [project-id title description]
  (try
    (jdbc/execute! db (str "insert into issues (id, project_id, title, description)"
                           " select id+1, '" project-id "' as project_id, '" title "' as title, '" description "'"
                           " from issues where project_id = '" project-id "'"
                           " order by id desc limit 1"))
    (catch Exception exception
      (do (logger/error "Exception when creating issue: " (.getMessage exception)) [0]))))

(defn set-issue-status [project-id id status]
  (try
    (jdbc/execute! db (str "update issues set status = '" status "'"
                           " where project_id='" project-id "' and id=" id))
    (catch Exception exception
      (do (logger/error "Exception when changing issue status: " (.getMessage exception)) [0]))))

(defn create-first-issue-for-project [project-id]
  (jdbc/execute! db (str "insert into issues (id, project_id, title, description, status)"
                         " values (1, '" project-id "', '" project-id " project created', '', 'Done')")))

