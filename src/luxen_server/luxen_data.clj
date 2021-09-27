(ns luxen-server.luxen-data
  (:require [clojure.java.jdbc :as jdbc]
            clojure.string))

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

(defn get-issue
  ([project-id issue-id]
   (jdbc/query db (str "select * from issues where id = " issue-id " and project_id = '" project-id "'")))
  ([issue-id]
   (let [split (clojure.string/split issue-id #"-")]
     (get-issue (first split) (second split))))
  )
