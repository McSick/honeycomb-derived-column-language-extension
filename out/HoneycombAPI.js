"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require('https');
class HoneycombAPI {
    constructor(_apikey) {
        this.default_options = {};
        this.default_options = {
            hostname: 'api.honeycomb.io',
            port: 443,
            headers: {
                'X-Honeycomb-Team': _apikey
            }
        };
    }
    get_all_columns(dataset, cb) {
        this.get(`/1/columns/${dataset}`, cb);
    }
    get_all_derived_columns(dataset, cb) {
        this.get(`/1/derived_columns/${dataset}`, cb);
    }
    create_new_derived_column(dataset, dc_def, cb) {
        this.post(`/1/derived_columns/${dataset}`, dc_def, cb);
    }
    update_derived_column(dataset, derived_column_id, dc_def, cb) {
        this.put(`/1/derived_columns/${dataset}/${derived_column_id}`, dc_def, cb);
    }
    delete_derived_column(dataset, derived_column_id, cb) {
        this.delete(`/1/derived_columns/${dataset}/${derived_column_id}`, cb);
    }
    get(path, cb) {
        this.request(cb, path, 'GET');
    }
    post(path, data, cb) {
        this.request(cb, path, 'POST', data);
    }
    delete(path, cb) {
        this.request(cb, path, 'DELETE');
    }
    put(path, data, cb) {
        this.request(cb, path, 'PUT', data);
    }
    request(cb, path, method, data) {
        var options = { ...this.default_options };
        options.path = path;
        options.method = method;
        if (data) {
            options.data = JSON.stringify(data);
        }
        var str = '';
        const req = https.request(options, (res) => {
            res.on('data', (body) => {
                str += body;
            });
            res.on('end', () => {
                return cb(JSON.parse(str));
            });
        });
        if (data) {
            req.write(data);
        }
        req.end();
    }
}
exports.default = HoneycombAPI;
//# sourceMappingURL=HoneycombAPI.js.map