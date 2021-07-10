const https = require('https');

export default class HoneycombAPI {

    private default_options = {
    }
    constructor(_apikey: string) {
        this.default_options = {
            hostname: 'api.honeycomb.io',
            port: 443,
            headers: {
                'X-Honeycomb-Team': _apikey
            }
        }
    }
    public get_all_columns(dataset:string, cb:any) {
        this.get(`/1/columns/${dataset}`, cb)
    }

    public get_all_derived_columns(dataset:string, cb:any) {
        this.get(`/1/derived_columns/${dataset}`, cb)
    }
    public create_new_derived_column(dataset: string, dc_def: DerivedColumn, cb: any) {
        this.post(`/1/derived_columns/${dataset}`, dc_def, cb);
    }
    public get_one_derived_column(dataset: string, derived_column_id: string, cb: any) {
        this.get(`/1/derived_columns/${dataset}/${derived_column_id}`, cb);
    }
    public update_derived_column(dataset: string, derived_column_id: string, dc_def:DerivedColumn,  cb: any) {
        this.put(`/1/derived_columns/${dataset}/${derived_column_id}`, dc_def, cb);
    }
    public create_query(dataset: string, query: any, cb: any) {
        this.post(`/1/queries/${dataset}`, query, cb);
    }
    public create_query_result(dataset: string, queryid: any, cb: any) {
        this.post(`/1/query_results/${dataset}`, { query_id: queryid }, cb);
    }
    public get_query_result(dataset: string, id: string, cb: any) {
        let numattempts = 0;
        this.pollresults(dataset, id, cb, numattempts);
    }
    private pollresults(dataset: string, id: string, cb: any, numattempts:number) {
        this.get(`/1/query_results/${dataset}/${id}`, (r: any) => {
            
            if (r.error) {
                cb(r);
            } else if (r.complete) {
                cb(r);
            } else if (numattempts > 10) {
                cb({ error: "Query timed out, please try again later."});
            } else {
                setTimeout(() => {
                    this.pollresults(dataset, id, cb, numattempts + 1);
                }, 500);
            }
        });
    }
    private get(path:string, cb:any) {
        this.request(cb, path, 'GET');
    }
    private post(path:string, data:object, cb:any) {
        this.request(cb, path, 'POST', data);
    }
    private delete(path:string, cb:any) {
        this.request(cb, path, 'DELETE');
    }
    private put(path:string, data:object, cb:any) {
        this.request(cb, path, 'PUT', data);
    }
    private request(cb:any, path:string, method:string, data?:object) {
        var options:any = { ...this.default_options };
        options.path = path;
        options.method = method;
        var str = '';
        const req = https.request(options, (res:any) => {
            res.on('data', (body: any) => {
                str += body;
            });
            res.on('end', () => {
                if (str === '') {
                    return cb();
                } else {
                    return cb(JSON.parse(str));
                }

            });
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.on('error', (err: any) => {
            console.error(err);
        });
        req.end();

    }
}