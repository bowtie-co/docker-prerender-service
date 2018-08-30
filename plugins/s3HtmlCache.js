var cache_manager = require('cache-manager');
var s3 = new (require('aws-sdk')).S3({params:{Bucket: process.env.S3_BUCKET_NAME}});

module.exports = {
    init: function() {
        this.cache = cache_manager.caching({
            store: s3_cache
        });
    },

    requestReceived: function(req, res, next) {
        if(req.method !== 'GET') {
            return next();
        }

        this.cache.get(req.prerender.url, function (err, data) {
            if(err) console.error(err, err.stack);

            if (!err && data) {
                console.log('cache hit');
                return res.send(200, data.Body);
            }
            
            next();
        });
    },

    beforeSend: function(req, res, next) {
        this.cache.set(req.prerender.url, req.prerender.documentHTML, function(err, data) {
            if (err) console.error(err, err.stack);
        });
        next();
    }
};


var s3_cache = {
    get: function(key, callback) {
        if (process.env.S3_PREFIX_KEY) {
            key = process.env.S3_PREFIX_KEY + '/' + key;
        }

        s3.getObject({
            Key: key
        }, callback);
    },
    set: function(key, value, callback) {
        if (process.env.S3_PREFIX_KEY) {
            key = process.env.S3_PREFIX_KEY + '/' + key;
        }

        var request = s3.putObject({
            Key: key,
            ContentType: 'text/html;charset=UTF-8',
            StorageClass: 'REDUCED_REDUNDANCY',
            Body: value
        }, callback);

        if (!callback) {
            request.send();
        }
    }
};