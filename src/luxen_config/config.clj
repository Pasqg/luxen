(ns luxen-config.config)

(defn tokenize [line]
  (clojure.string/split line #"[ \t\n\r]+"))

(defn to-key-values [lines]
  (map #(vector (keyword (first %1))
                (cond
                  (== 2 (count %1)) (second %1)
                  :else (rest %1)))
       lines))


(defn read-config-file [file-name]
  (as-> file-name x
        (slurp x)
        (clojure.string/split x #"\n")
        (map tokenize x)
        (to-key-values x)
        (into {} x)))

