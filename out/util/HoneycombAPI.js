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
    get_one_derived_column(dataset, derived_column_id, cb) {
        this.get(`/1/derived_columns/${dataset}/${derived_column_id}`, cb);
    }
    update_derived_column(dataset, derived_column_id, dc_def, cb) {
        this.put(`/1/derived_columns/${dataset}/${derived_column_id}`, dc_def, cb);
    }
    delete_derived_column(dataset, derived_column_id, cb) {
        this.delete(`/1/derived_columns/${dataset}/${derived_column_id}`, cb);
    }
    create_query(dataset, query, cb) {
        this.post(`/1/queries/${dataset}`, query, cb);
    }
    create_query_result(dataset, queryid, cb) {
        this.post(`/1/query_results/${dataset}`, { query_id: queryid }, cb);
    }
    get_query_result(dataset, id, cb) {
        let numattempts = 0;
        this.pollresults(dataset, id, cb, numattempts);
    }
    pollresults(dataset, id, cb, numattempts) {
        this.get(`/1/query_results/${dataset}/${id}`, (r) => {
            if (r.error) {
                cb(r);
            }
            else if (r.complete) {
                cb(r);
            }
            else if (numattempts > 10) {
                cb({ error: "Query timed out, please try again later." });
            }
            else {
                setTimeout(() => {
                    this.pollresults(dataset, id, cb, numattempts + 1);
                }, 500);
            }
        });
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
        var str = '';
        const req = https.request(options, (res) => {
            res.on('data', (body) => {
                str += body;
            });
            res.on('end', () => {
                if (str === '') {
                    return cb();
                }
                else {
                    return cb(JSON.parse(str));
                }
            });
        });
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.on('error', (err) => {
            console.error(err);
        });
        req.end();
    }
}
exports.default = HoneycombAPI;
//# sourceMappingURL=HoneycombAPI.js.map