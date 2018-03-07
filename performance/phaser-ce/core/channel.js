/**
 * net work module.
 * encode -> requset
 */

define(function (require, exports, module) {

    /**
     * protocol module, for encoding & decoding。
     */
    var Protocol = (function () {

        /**
         * encode message
         * @public
         * @param {object} msg 
         * @return {string} 
         */
        function encode(msg) {
            if (DEV) {
                return JSON.stringify(msg);
            }
            return JSON.stringify(msg);
        }

        /**
         * decode message
         * @public
         * @param {string} msg 
         * @return {object}
         */
        function decode(msg) {
            if (DEV) {
                return JSON.parse(msg);
            }
            return JSON.parse(msg);
        }

        return {
            encode: encode,
            decode: decode
        };
    })();

    /**
     * wrapper for fetch.
     */
    var httpClient = (function () {
        /**
         * post data
         * @private
         * @param {string} uri : api uri
         * @param {string} data: data to be post
         * @param {object} header: custom http header
         */
        function _post(uri, data, header) {
            var customHeader = header || {};
            customHeader['Content-Type'] = 'application/json';
            return fetch(uri, {
                // credentials: "include",
                mode: 'cors',
                method: 'POST',
                body: data,
                headers: customHeader
            });
        }

        /**
         * post data
         * @public
         * @param {string} uri : api uri
         * @param {string} data: data to be post
         * @param {object} header: custom http header
         */
        function post(uri, msg, header) {

            var encoded_msg = Protocol.encode(msg);

            var promise = new Promise(function (resolve, reject) {
                _post(uri, encoded_msg, header)
                    .then(function (res) {
                        if (res.ok) {
                            return res.text();
                        } else {
                            reject(res);
                        }
                    }).then(function (res) {
                        var res_data = Protocol.decode(res);
                        res_data.ok = true;
                        resolve(res_data);
                    })
                    .catch(function (res) {
                        reject({
                            status: 666,
                            statusText: res.message
                        });
                    });
            });

            return promise;
        }

        return {
            post: post
        };

    })();

    /**
     * post data
     * @public
     * @param {string} uri : api uri
     * @param {string} data: data to be post
     * @param {object} header: custom http header
     */
    function post(uri, msg, header) {

        console.log('post --> ', uri, msg, header);

        var promise = new Promise(function (resolve, reject) {
            httpClient.post(uri, msg, header)
                .then(function (res) {
                    console.log('recieve <-- ', uri, res);
                    resolve(res);
                })
                .catch(function (res) {
                    console.log('error <-- ', uri, res);
                    reject({
                        code: -res.status,
                        error: res.statusText
                    });
                });
        });
        return promise;
    }

    return {
        post: post
    };

});