import { Uri, window, commands, TextDocument, workspace } from "vscode";
import Config from "../util/Config";
import HoneycombAPI from "../util/HoneycombAPI";
import * as vscode from "vscode";
import { formatString, minimizeString, isError } from '../util/Helpers';
export default class HoneycombController {
    private static readonly _hnyapi: HoneycombAPI = new HoneycombAPI(
        Config.get("apikey")
    );
    private static saveDerivedColumnToSource(column: DerivedColumn, path: string) {
        const wsedit = new vscode.WorkspaceEdit();
        const filePath = vscode.Uri.file(path);
        wsedit.createFile(filePath, { ignoreIfExists: true });
        wsedit.replace(
            filePath,
            new vscode.Range(0, 0, 10000, 0),
            formatString(minimizeString(column.expression)));

        vscode.workspace.applyEdit(wsedit).then(() => {
            vscode.workspace.openTextDocument(filePath).then((doc: TextDocument) => {
                if (doc.isDirty) {
                    doc.save();
                }
            });
        });
    }
    public static delete(uri: Uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        let dataset_settings: any = { ...Config.get("dataset_settings") };
        let id = dataset_settings[dataset].derived_columns[alias].id || null;
        if (id) {
            HoneycombController._hnyapi.delete_derived_column(dataset, id, () => {
                window.showInformationMessage(`Deleted DerivedColumn ${alias}`);
                const wsedit = new vscode.WorkspaceEdit();
                wsedit.deleteFile(uri);
                vscode.workspace.applyEdit(wsedit).then(() => {
                    dataset_settings[dataset].derived_columns[alias] = undefined;
                    Config.set("dataset_settings", dataset_settings).then((success: any) => {
                    });
                });

            });
        }
    }
    public static pull(uri: Uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];

        let dataset_settings: any = { ...Config.get("dataset_settings") };
        let id = dataset_settings[dataset].derived_columns[alias].id || null;
        if (id) {
            HoneycombController._hnyapi.get_one_derived_column(dataset, id, (dc: DerivedColumn | HoneycombError) => {

                if (isError(dc)) {
                    window.showErrorMessage(dc.error);
                } else if (dc) {
                    let col = dc as DerivedColumn;
                    HoneycombController.saveDerivedColumnToSource(col, uri.fsPath);
                    dataset_settings[dataset].derived_columns[dc.alias] = { id: dc.id, description: dc.description };
                }


                Config.set("dataset_settings", dataset_settings).then((success: any) => {

                });
            })

        } else {
            window.showErrorMessage("ID not saved locally. Please pull all from dataset to get derived column id.");
        }
    }

    public static pullAll(uri: Uri) {
        let patharr = uri.fsPath.split("/");
        let dataset = patharr[patharr.length - 1];
        let dataset_settings: any = Config.get("dataset_settings");
        if (!dataset_settings.hasOwnProperty(dataset)) {
            dataset_settings[dataset] = {
                derived_columns: {},
                columns: {},
            };
        }
        HoneycombController._hnyapi.get_all_columns(dataset, (dataset_columns: any) => {
            dataset_settings[dataset].columns = dataset_columns;
            HoneycombController._hnyapi.get_all_derived_columns(dataset, (columns: any) => {
                if (columns.error) {
                    window.showErrorMessage(columns.error);
                }

                columns.forEach((dc: any) => {
                    if (dc) {
                        let col = dc as DerivedColumn;
                        HoneycombController.saveDerivedColumnToSource(col, `${uri.fsPath}/${dc.alias}.honeycomb`);
                        dataset_settings[dataset].derived_columns[dc.alias] = {
                            id: dc.id,
                            description: dc.description,
                        };
                    }
                });
                Config.set("dataset_settings", dataset_settings);
            });
        });
    }

    public static push(uri: Uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        workspace.openTextDocument(uri.fsPath).then((document: TextDocument) => {
            let expression: string = document.getText();
            let minizedexpression = minimizeString(expression);

            let dataset_settings = Config.get('dataset_settings');
            if (dataset_settings[dataset].derived_columns[alias]) {
                let id = dataset_settings[dataset].derived_columns[alias].id;
                let dc: DerivedColumn = {
                    id: id,
                    description: dataset_settings[dataset].derived_columns[alias].description,
                    alias: alias,
                    expression: minizedexpression
                }
                HoneycombController._hnyapi.update_derived_column(dataset, id, dc, (col: DerivedColumn | HoneycombError) => {
                    if (isError(col)) {
                        window.showErrorMessage(col.error);
                    } else {
                        window.showInformationMessage(`Updated DerivedColumn ${col.alias}`);
                    }
                });
            } else {
                let dc: DerivedColumn = {
                    description: "",
                    alias: alias,
                    expression: minizedexpression
                }
                HoneycombController._hnyapi.create_new_derived_column(dataset, dc, (col: DerivedColumn | HoneycombError) => {
                    if (isError(col)) {
                        window.showErrorMessage(col.error);
                    } else {
                    
                        dataset_settings[dataset].derived_columns[col.alias] = { id: col.id, description: col.description };
                        window.showInformationMessage(`Created DerivedColumn ${col.alias} with id ${col.id}`);
                        Config.set("dataset_settings", dataset_settings).then((success: any) => {
                        });
                    }
                });
            }
        })
    }

    public static query(uri: Uri) {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        HoneycombController._hnyapi.create_query(dataset, {
            breakdowns: [alias],
            calculations: [{ "op": "COUNT" }],
            time_range: 7200
        },
            (query: any) => {
                if (query.id) {
                    HoneycombController._hnyapi.create_query_result(dataset, query.id, (query_result: any) => {
                        if (query_result.id) {
                            HoneycombController._hnyapi.get_query_result(dataset, query_result.id, (query_data_result: any) => {
                                if (query_data_result.error) {
                                    window.showErrorMessage(query_data_result.error);
                                } else {
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
                                    commands.executeCommand('HoneycombResult.show', table, dataset, query_data_result.id);
                                }
                            })
                        } else if (query_result.error) {
                            window.showErrorMessage(query_result.error);
                        } else {
                            window.showErrorMessage("Something went wrong");
                        }
                    })

                } else if (query.error) {
                    window.showErrorMessage(query.error);
                } else {
                    window.showErrorMessage("Something went wrong");
                }
            });
    }
}
