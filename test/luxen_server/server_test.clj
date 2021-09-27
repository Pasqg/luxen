(ns luxen-server.server-test
  (:require [clojure.test :refer :all]
            [ring.mock.request :as mock]
            [clojure-web-server.handler :refer :all])
  (:use luxen-server.server))

(deftest test-server
  (testing "main route"
    (let [response (luxen-server-config (mock/request :get "/"))]
      (is (= (:status response) 200))
      (is (= (:body response) "Hello World"))))

  (testing "not-found route"
    (let [response (luxen-server-config (mock/request :get "/invalid"))]
      (is (= (:status response) 404)))))
