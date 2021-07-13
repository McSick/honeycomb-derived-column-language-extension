"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Config_1 = require("../util/Config");
const HoneycombAPI_1 = require("../util/HoneycombAPI");
const vscode = require("vscode");
const Helpers_1 = require("../util/Helpers");
class HoneycombController {
    static saveDerivedColumnToSource(column, path) {
        const wsedit = new vscode.WorkspaceEdit();
        const filePath = vscode.Uri.file(path);
        wsedit.createFile(filePath, { ignoreIfExists: true });
        wsedit.replace(filePath, new vscode.Range(0, 0, 10000, 0), Helpers_1.formatString(Helpers_1.minimizeString(column.expression)));
        vscode.workspace.applyEdit(wsedit).then(() => {
            vscode.workspace.openTextDocument(filePath).then((doc) => {
                if (doc.isDirty) {
                    doc.save();
                }
            });
        });
    }
    static pull(uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        let dataset_settings = { ...Config_1.default.get("dataset_settings") };
        let id = dataset_settings[dataset].derived_columns[alias].id || null;
        if (id) {
            HoneycombController._hnyapi.get_one_derived_column(dataset, id, (dc) => {
                if (Helpers_1.isError(dc)) {
                    vscode_1.window.showErrorMessage(dc.error);
                }
                else if (dc) {
                    let col = dc;
                    HoneycombController.saveDerivedColumnToSource(col, uri.fsPath);
                    dataset_settings[dataset].derived_columns[dc.alias] = {
                        id: dc.id,
                        description: dc.description,
                    };
                }
                Config_1.default.set("dataset_settings", dataset_settings).then((success) => { });
            });
        }
        else {
            vscode_1.window.showErrorMessage("ID not saved locally. Please pull all from dataset to get DerivedColumn id.");
        }
    }
    static pullAll(uri) {
        let patharr = uri.fsPath.split("/");
        let dataset = patharr[patharr.length - 1];
        let dataset_settings = Config_1.default.get("dataset_settings");
        //if (!dataset_settings.hasOwnProperty(dataset)) {
        dataset_settings[dataset] = {
            derived_columns: {},
            columns: {},
        };
        // }
        HoneycombController._hnyapi.get_all_columns(dataset, (dataset_columns) => {
            dataset_settings[dataset].columns = dataset_columns;
            HoneycombController._hnyapi.get_all_derived_columns(dataset, (columns) => {
                if (columns.error) {
                    vscode_1.window.showErrorMessage(columns.error);
                }
                columns.forEach((dc) => {
                    if (dc) {
                        let col = dc;
                        HoneycombController.saveDerivedColumnToSource(col, `${uri.fsPath}/${dc.alias}.honeycomb`);
                        dataset_settings[dataset].derived_columns[dc.alias] = {
                            id: dc.id,
                            description: dc.description,
                        };
                    }
                });
                Config_1.default.set("dataset_settings", dataset_settings);
            });
        });
    }
    static create_new_derived_column(dataset, dc) {
        let dataset_settings = Config_1.default.get("dataset_settings");
        HoneycombController._hnyapi.create_new_derived_column(dataset, dc, (col) => {
            if (Helpers_1.isError(col)) {
                vscode_1.window.showErrorMessage(col.error);
            }
            else {
                dataset_settings[dataset].derived_columns[col.alias] = {
                    id: col.id,
                    description: col.description,
                };
                vscode_1.window.showInformationMessage(`Created DerivedColumn ${col.alias} with id ${col.id}`);
                Config_1.default.set("dataset_settings", dataset_settings).then((success) => { });
            }
        });
    }
    static update_derived_column(dataset, dc) {
        HoneycombController._hnyapi.update_derived_column(dataset, dc.id, dc, (col) => {
            if (Helpers_1.isError(col)) {
                if (col.error === 'derived column not found') {
                    vscode_1.window.showWarningMessage('DerivedColumn not found, creating new DerivedColumn');
                    delete dc["id"];
                    HoneycombController.create_new_derived_column(dataset, dc);
                }
                else {
                    vscode_1.window.showErrorMessage(col.error);
                }
            }
            else {
                vscode_1.window.showInformationMessage(`Updated DerivedColumn ${col.alias}`);
            }
        });
    }
    static push(uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        vscode_1.workspace.openTextDocument(uri.fsPath).then((document) => {
            let expression = document.getText();
            let minizedexpression = Helpers_1.minimizeString(expression);
            let dataset_settings = Config_1.default.get("dataset_settings");
            if (dataset_settings[dataset].derived_columns[alias]) {
                let id = dataset_settings[dataset].derived_columns[alias].id;
                let dc = {
                    id: id,
                    description: dataset_settings[dataset].derived_columns[alias].description,
                    alias: alias,
                    expression: minizedexpression,
                };
                HoneycombController.update_derived_column(dataset, dc);
            }
            else {
                let dc = {
                    description: "",
                    alias: alias,
                    expression: minizedexpression,
                };
                HoneycombController.create_new_derived_column(dataset, dc);
            }
        });
    }
    static query(uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        HoneycombController._hnyapi.create_query(dataset, {
            breakdowns: [alias],
            calculations: [{ op: "COUNT" }],
            time_range: 7200,
        }, (query) => {
            if (query.id) {
                HoneycombController._hnyapi.create_query_result(dataset, query.id, (query_result) => {
                    if (query_result.id) {
                        HoneycombController._hnyapi.get_query_result(dataset, query_result.id, (query_data_result) => {
                            if (query_data_result.error) {
                                vscode_1.window.showErrorMessage(query_data_result.error);
                            }
                            else {
                                let data = query_data_result.data.results;
                                let table = `<tr><th>${alias}</th><th>Count</th></tr>`;
                                for (var i = 0; i < data.length; i++) {
                                    if (i > 10) {
                                        break;
                                    }
                                    let name = data[i].data[alias];
                                    let count = data[i].data.COUNT;
                                    let row = `<tr><td>${name}</td><td>${count}</td></tr>`;
                                    table += row;
                                }
                                vscode_1.commands.executeCommand("HoneycombResult.show", table, dataset, query_data_result.id);
                            }
                        });
                    }
                    else if (query_result.error) {
                        vscode_1.window.showErrorMessage(query_result.error);
                    }
                    else {
                        vscode_1.window.showErrorMessage("Something went wrong");
                    }
                });
            }
            else if (query.error) {
                vscode_1.window.showErrorMessage(query.error);
            }
            else {
                vscode_1.window.showErrorMessage("Something went wrong");
            }
        });
    }
}
exports.default = HoneycombController;
HoneycombController._hnyapi = new HoneycombAPI_1.default(Config_1.default.get("apikey"));
//# sourceMappingURL=HoneycombController.js.map