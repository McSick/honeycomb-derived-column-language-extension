"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode = require("vscode");
const Config_1 = require("../util/Config");
const textdefinitions_1 = require("../util/textdefinitions");
class HoneyCombItemProvider {
    constructor() {
        this.keys = Array.from(textdefinitions_1.default.keys());
    }
    provideCompletionItems(document, position, token) {
        let fsPath = document.fileName;
        let patharr = fsPath.split("/");
        let alias = patharr[patharr.length - 1].split(".")[0];
        let dataset = patharr[patharr.length - 2];
        let range = document.getWordRangeAtPosition(position, /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\\,\.\<\>\/\?\s]+)/g);
        const word = document.getText(range);
        var result = [];
        let dataset_settings = Config_1.default.get("dataset_settings");
        if (dataset_settings[dataset]) {
            let cols = dataset_settings[dataset].columns;
            cols.forEach((col) => {
                let nodollar = word.replace("$", "");
                if (col.key_name.includes(nodollar)) {
                    var completionitem = new vscode_1.CompletionItem(col.key_name, vscode_1.CompletionItemKind.Variable);
                    completionitem.documentation = new vscode_1.MarkdownString(`${col.key_name}:${col.type}   \n\n${col.description}`, true);
                    let dollarsign = word.includes("$") ? "" : "$";
                    if (col.key_name.includes(" ")) {
                        completionitem.insertText = `${dollarsign}"${col.key_name}"`;
                    }
                    else {
                        completionitem.insertText = `${dollarsign}${col.key_name}`;
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
                    if (worddef.is_snippet) {
                        var completionitem = new vscode_1.CompletionItem(item, vscode_1.CompletionItemKind.Snippet);
                        completionitem.insertText = new vscode.SnippetString(itemdefs[i]);
                        result.push(completionitem);
                    }
                    else {
                        var completionitem = new vscode_1.CompletionItem(item, vscode_1.CompletionItemKind.Function);
                        completionitem.documentation = new vscode_1.MarkdownString(`${worddef.SIGNATURES[0]}   \n\n${worddef.HOVER}`, true);
                        completionitem.insertText = new vscode.SnippetString(itemdefs[i]);
                        result.push(completionitem);
                    }
                });
            });
        }
        if (result.length > 0) {
            return result;
        }
    }
}
exports.default = HoneyCombItemProvider;
//# sourceMappingURL=HoneyCombItemProvider.js.map