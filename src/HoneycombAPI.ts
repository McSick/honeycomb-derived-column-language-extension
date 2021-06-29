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
    public update_derived_column(dataset: string, derived_column_id: string, dc_def:DerivedColumn,  cb: any) {
        this.put(`/1/derived_columns/${dataset}/${derived_column_id}`, dc_def, cb);
    }
    public delete_derived_column(dataset: string, derived_column_id: string, cb?: any) {
        this.delete(`/1/derived_columns/${dataset}/${derived_column_id}`, cb);
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