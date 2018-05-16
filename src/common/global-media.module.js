angular.module('media-service', []).factory('MediaService', function ($http, $q) {
    function youtube_id_from_url(url) {
        var id = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
            id = url[2].split(/[^0-9a-z_]/i);
            id = id[0];
        } else {
            id = url;
        }
        return id;
    }

    function vimeo_id_from_url(url) {
        var regExp = /(http:\/\/|https:\/\/)?(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/;
        var match = url.match(regExp);
        if (match) {
            return match[3];
        }
    }

    function getPropByString(obj, propString) {
        if (!propString) {
            return obj;
        }

        var prop, props = propString.split('.');
        for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
            prop = props[i];

            var candidate = obj[prop];
            if (candidate !== undefined) {
                obj = candidate;
            } else {
                break;
            }
        }
        return obj[props[i]];
    }

    var apiNames = ['youtube', 'vimeo'];

    var apis = {
        youtube: {
            url: 'http://gdata.youtube.com/feeds/api/videos/%s%?v=2&alt=jsonc',
            title: 'data.title',
            description: 'data.description',
            preview_thumb: 'data.thumbnail.sqDefault',
            parse: youtube_id_from_url

        },
        // vimeo: {
        //     url: 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/%s%',
        //     title: 'title',
        //     description: 'description',
        //     preview_thumb: 'thumbnail_url',
        //     parse: vimeo_id_from_url
        // },
        image: {
            title: '%s%',
            description: '',
            preview_thumb: '%s%',
            parse: function (url) {
                return url;
            }
        }
    };

    return {
        getHash: function (url) {
            var hash = {
                preview_thumb: '',
                meta: {
                    title: '',
                    description: '',
                }
            };
            var api = 'image';
            var id = '';

            apiNames.map(function (el, ix, arr) {
                if (url.indexOf(el) > -1) {
                    api = el;
                }
            });

            var deferred = $q.defer();

            if (apis[api].url) {
                var apiUrl = apis[api].url.replace('%s%', apis[api].parse(url));
                $http({method: 'GET', url: apiUrl}, function (data, status, headers, config) {
                    hash.preview_thumb = getPropByString(data, apis[api].preview_thumb);
                    hash.meta.title = getPropByString(data, apis[api].title);
                    hash.meta.description = getPropByString(data, apis[api].description);
                    //The rest from the api, if you want it.
                    hash.meta.data = data;
                    deferred.resolve(hash);
                }, function (data, status, headers, config) {
                    deferred.reject(data);
                });
            } else {
                if (url.length && url.length > 4) {
                    hash.preview_thumb = url;
                    hash.meta.title = url;
                    hash.meta.description = '';
                    //The rest from the api, if you want it.
                    deferred.resolve(hash);
                } else {
                    deferred.reject({'error': 'invalid url'});
                }
            }

            return deferred.promise;
        }
    };
});
