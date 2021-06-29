"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const HoneycombAPI_1 = require("./HoneycombAPI");
const vscode_1 = require("vscode");
const textdefinitions_1 = require("./textdefinitions");
const HONEYCOMB_SELECTOR = "honeycomb-derived";
var hnyapi = new HoneycombAPI_1.default(vscode.workspace.getConfiguration(HONEYCOMB_SELECTOR).apikey);
// const MINIFYREGEX = /\s+(?=((\\[\\"`']|[^\\"^`'])*[`'"](\\[\\"`']|[^\\"^`'])*["'`])*(\\[\\"'`]|[^\\"^`'])*$)/g;
// const regextest = /(?=\S)[^"\s]*(?:"[^\\"]*(?:\\[  ][^\\"]*)*"[^"\s]*)*/g;
//REGEX is hard.  For loop FTW
function minimizeString(s) {
    let newstring = "";
    let inside = false;
    let inside_char = "";
    for (let i = 0; i < s.length; i++) {
        let c = s[i];
        if (c == '"' || c == "`") {
            if (!inside) {
                inside = true;
                inside_char = c;
            }
            else if (inside && inside_char == c) {
                inside = false;
                inside_char = "";
            }
            newstring += c;
            continue;
        }
        else if (inside) {
            newstring += c;
        }
        else {
            newstring += c.trim();
        }
    }
    return newstring;
}
function formatString(minifiedtext) {
    let paren = 0;
    let result = "";
    let inquote = false;
    let inquote_start_chart = "";
    for (var i = 0; i < minifiedtext.length; i++) {
        let charat = minifiedtext[i];
        if (charat == '"' || charat == "`") {
            if (!inquote) {
                inquote = true;
                inquote_start_chart = charat;
            }
            else if (inquote_start_chart == charat) {
                inquote = false;
                inquote_start_chart = "";
            }
            result += charat;
            continue;
        }
        if (inquote) {
            result += charat;
        }
        else if (charat == ",") {
            result += charat + "\n" + "\t".repeat(paren);
        }
        else if (charat == "(") {
            paren++;
            if (i < minifiedtext.length - 1) {
                if (minifiedtext[i + 1] == ")") {
                    i++;
                    paren--;
                    result += charat + ")";
                }
                else {
                    result += charat + "\n" + "\t".repeat(paren);
                }
            }
            else {
                result += charat + "\n" + "\t".repeat(paren);
            }
        }
        else if (charat == ")") {
            paren--;
            if (i < minifiedtext.length - 1) {
                if (minifiedtext[i + 1] == ",") {
                    result += "\n" + "\t".repeat(paren) + charat + ",\n";
                    i++;
                    result += "\t".repeat(paren);
                }
                else {
                    result += "\n" + "\t".repeat(paren) + charat;
                }
            }
            else {
                result += "\n" + "\t".repeat(paren) + charat + "\n";
            }
        }
        else {
            result += charat;
        }
    }
    return result;
}
// import { workspace, Disposable, ExtensionContext } from 'vscode';
// import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(vscode.languages.registerHoverProvider(HONEYCOMB_SELECTOR, new HoneyCombHoverProvider()));
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(HONEYCOMB_SELECTOR, new HoneCombSignatureProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HONEYCOMB_SELECTOR, new HoneyCombItemProvider(), "\\u0008", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(HONEYCOMB_SELECTOR, new HoneyCombDocumentFormattingEditProvider()));
    // context.subscriptions.push(
    //   vscode.languages.registerOnTypeFormattingEditProvider(
    //     HONEYCOMB_SELECTOR,
    //     new HoneyCombDocumentFormattingEditProvider(),
    //     "\n",
    //     ","
    //   )
    // );
    context.subscriptions.push(vscode.commands.registerCommand("extension.minimize", () => {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor &&
            activeTextEditor.document.languageId === HONEYCOMB_SELECTOR) {
            const { document } = activeTextEditor;
            let text = document.getText();
            const edit = new vscode.WorkspaceEdit();
            let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
            edit.replace(document.uri, fullRange, minimizeString(text));
            return vscode.workspace.applyEdit(edit);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.pull", () => {
    }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.push", (uri) => {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        vscode_1.workspace.openTextDocument(uri.fsPath).then((document) => {
            let expression = document.getText();
            let minizedexpression = minimizeString(expression);
            let config = vscode.workspace.getConfiguration(HONEYCOMB_SELECTOR);
            if (config.dataset_settings[dataset].derived_columns[alias]) {
                let id = config.dataset_settings[dataset].derived_columns[alias].id;
                let dc = {
                    id: id,
                    description: config.dataset_settings[dataset].derived_columns[alias].description,
                    alias: alias,
                    expression: minizedexpression
                };
                hnyapi.update_derived_column(dataset, id, dc, (success) => {
                    if (success.error) {
                        vscode.window.showErrorMessage(success.error);
                    }
                    else {
                        vscode.window.showInformationMessage(`Updated DerivedColumn ${success.alias}`);
                    }
                });
            }
            else {
                let dc = {
                    description: "",
                    alias: alias,
                    expression: minizedexpression
                };
                hnyapi.create_new_derived_column(dataset, dc, (success) => {
                    if (success.error) {
                        vscode.window.showErrorMessage(success.error);
                    }
                    if (success.hasOwnProperty("id")) {
                        let dataset_settings = config.get("dataset_settings");
                        dataset_settings[dataset].derived_columns[success.alias] = { id: success.id, description: success.description };
                        vscode.window.showInformationMessage(`Created DerivedColumn ${success.alias} with id ${success.id}`);
                        config.update("dataset_settings", dataset_settings).then((success) => {
                        });
                    }
                });
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.delete", (uri) => {
        let patharr = uri.fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        let config = vscode.workspace.getConfiguration(HONEYCOMB_SELECTOR);
        let dataset_settings = { ...config.get("dataset_settings") };
        let id = dataset_settings[dataset].derived_columns[alias].id || null;
        if (id) {
            hnyapi.delete_derived_column(dataset, id, () => {
                vscode.window.showInformationMessage(`Deleted DerivedColumn ${alias}`);
                const wsedit = new vscode.WorkspaceEdit();
                wsedit.deleteFile(uri);
                vscode.workspace.applyEdit(wsedit).then(() => {
                    dataset_settings[dataset].derived_columns[alias] = undefined;
                    config.update("dataset_settings", dataset_settings).then((success) => {
                    });
                });
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.validate", (uri) => {
    }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.pullall", (uri) => {
        let patharr = uri.fsPath.split("/");
        let dataset = patharr[patharr.length - 1];
        let config = vscode.workspace.getConfiguration(HONEYCOMB_SELECTOR);
        let dataset_settings = config.get("dataset_settings");
        if (!dataset_settings.hasOwnProperty(dataset)) {
            dataset_settings[dataset] = {
                derived_columns: {},
                columns: {}
            };
        }
        hnyapi.get_all_columns(dataset, (dataset_columns) => {
            dataset_settings[dataset].columns = dataset_columns;
            hnyapi.get_all_derived_columns(dataset, (columns) => {
                if (columns.error) {
                    vscode.window.showErrorMessage(columns.error);
                }
                columns.forEach((dc) => {
                    if (dc) {
                        let col = dc;
                        saveFile(col, uri.fsPath);
                        dataset_settings[dataset].derived_columns[dc.alias] = { id: dc.id, description: dc.description };
                    }
                });
                config.update("dataset_settings", dataset_settings).then((success) => {
                });
            });
        });
    }));
}
exports.activate = activate;
function saveFile(column, path) {
    const wsedit = new vscode.WorkspaceEdit();
    const filePath = vscode.Uri.file(`${path}/${column.alias}.honeycomb`);
    wsedit.createFile(filePath, { ignoreIfExists: true });
    wsedit.replace(filePath, new vscode.Range(0, 0, 10000, 0), formatString(minimizeString(column.expression)));
    vscode.workspace.applyEdit(wsedit).then(() => {
        vscode.workspace.openTextDocument(filePath).then((doc) => {
            if (doc.isDirty) {
                doc.save();
            }
        });
    });
}
class HoneyCombDocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document, options, token) {
        var doctext = document.getText();
        let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
        let result = "";
        var minifiedtext = this.minifyText(doctext);
        result = this.format(minifiedtext);
        return [vscode_1.TextEdit.replace(fullRange, result)];
    }
    provideOnTypeFormattingEdits(document, position, ch, options, token) {
        var doctext = document.getText();
        let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
        let result = "";
        var minifiedtext = this.minifyText(doctext);
        result = this.format(minifiedtext);
        return [vscode_1.TextEdit.replace(fullRange, result)];
    }
    minifyText(text) {
        return minimizeString(text);
    }
    format(minifiedtext) {
        return formatString(minifiedtext);
    }
}
class HoneyCombItemProvider {
    constructor() {
        this.keys = Array.from(textdefinitions_1.default.keys());
    }
    provideCompletionItems(document, position, token) {
        let fsPath = document.fileName;
        let patharr = fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        let config = vscode.workspace.getConfiguration(HONEYCOMB_SELECTOR);
        let range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        var result = [];
        if (config.dataset_settings[dataset]) {
            let cols = config.dataset_settings[dataset].columns;
            cols.forEach((col) => {
                if (col.key_name.includes(word)) {
                    var completionitem = new vscode_1.CompletionItem(col.key_name, vscode_1.CompletionItemKind.Variable);
                    completionitem.documentation = new vscode_1.MarkdownString(`${col.key_name}:${col.type}   \n\n${col.description}`, true);
                    if (col.key_name.includes(" ")) {
                        completionitem.insertText = `$"${col.key_name}"`;
                    }
                    else {
                        completionitem.insertText = `$${col.key_name}`;
                    }
                    result.push(completionitem);
                }
            });
        }
        let foundkeys = this.keys.filter((key) => {
            return key.includes(word);
        });
        if (foundkeys.length > 0) {
            foundkeys.forEach((key) => {
                var worddef = textdefinitions_1.default.get(key);
                var itemdefs = worddef.COMPLETIONITEMS;
                var itemlabels = worddef.COMPLETIONLABELS;
                itemlabels.forEach((item, i) => {
                    var completionitem = new vscode_1.CompletionItem(item, vscode_1.CompletionItemKind.Function);
                    completionitem.documentation = new vscode_1.MarkdownString(`${worddef.SIGNATURES[0]}   \n\n${worddef.HOVER}`, true);
                    completionitem.insertText = new vscode.SnippetString(itemdefs[i]);
                    result.push(completionitem);
                });
            });
        }
        if (result.length > 0) {
            return result;
        }
    }
}
class HoneyCombHoverProvider {
    provideHover(document, position, token) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        if (textdefinitions_1.default.has(word)) {
            var def = textdefinitions_1.default.get(word);
            var hoverdef = def.HOVER;
            var signdef = def.SIGNATURES[0];
            return new vscode_1.Hover(new vscode_1.MarkdownString(`${signdef}   \n\n${hoverdef}`, true));
        }
    }
}
class HoneCombSignatureProvider {
    provideSignatureHelp(document, position, token) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        var result = [];
        if (textdefinitions_1.default.has(word)) {
            var itemdefs = textdefinitions_1.default.get(word).SIGNATURES;
            itemdefs.forEach((item) => {
                result.push(new vscode_1.SignatureInformation(word, new vscode_1.MarkdownString(item, true)));
            });
        }
        if (result.length > 0) {
            return {
                signatures: result,
                activeParameter: 0,
                activeSignature: 0,
            };
        }
    }
}
//# sourceMappingURL=extension.js.map