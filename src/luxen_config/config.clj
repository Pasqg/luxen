(ns luxen-config.config
  (:require [clojure.tools.logging :as logger])
  (:import (ch.qos.logback.classic Level)
           (ch.qos.logback.classic Logger)
           (org.slf4j LoggerFactory)))

(defn tokenize [line]
  (clojure.string/split line #"[ \t\n\r]+"))

(defmulti parse (fn [tokens] (first tokens)))

(defmethod parse "logger.level" [tokens]
  (let [logger-name ^String (second tokens)
        level (nth tokens 2)]
    (.setLevel
      ^Logger (cast Logger (LoggerFactory/getLogger logger-name))
      (Level/valueOf level))
    (logger/info "Read logger level " level " for " logger-name)))

(defn read-config [file-name]
  (as-> file-name x
        (slurp x)
        (clojure.string/split x #"\n")
        (into {} (map #(-> %1 tokenize parse) x))))