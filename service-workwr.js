const CACHE_NAME =
    "inventarisku-ardhecil-v10";


const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./foto2.jpeg"
];


/* ========================================= */
/* INSTALL */
/* ========================================= */

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                function (cache) {

                    return cache.addAll(
                        APP_FILES
                    );

                }
            )

        );


        self.skipWaiting();

    }
);


/* ========================================= */
/* ACTIVATE */
/* ========================================= */

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches.keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function (
                                    cacheName
                                ) {

                                    if (
                                        cacheName
                                        !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            cacheName
                                        );

                                    }

                                    return null;

                                }
                            )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


/* ========================================= */
/* FETCH */
/* ========================================= */

self.addEventListener(
    "fetch",
    function (event) {


        if (
            event.request.method
            !==
            "GET"
        ) {

            return;

        }


        event.respondWith(

            fetch(
                event.request
            )
            .then(
                function (response) {

                    if (
                        response
                        &&
                        response.status
                        ===
                        200
                    ) {

                        const copy =
                            response.clone();


                        caches.open(
                            CACHE_NAME
                        )
                        .then(
                            function (cache) {

                                cache.put(
                                    event.request,
                                    copy
                                );

                            }
                        );

                    }


                    return response;

                }
            )
            .catch(
                function () {

                    return caches.match(
                        event.request
                    );

                }
            )

        );

    }
);