"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const textdefinitions_1 = require("./textdefinitions");
const HONEYCOMB_SELECTOR = "honeycomb-derived";
// import { workspace, Disposable, ExtensionContext } from 'vscode';
// import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(vscode.languages.registerHoverProvider(HONEYCOMB_SELECTOR, new HoneyCombHoverProvider()));
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(HONEYCOMB_SELECTOR, new HoneCombSignatureProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HONEYCOMB_SELECTOR, new HoneyCombItemProvider(), "\\u0008", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(HONEYCOMB_SELECTOR, new HoneyCombDocumentFormattingEditProvider()));
    context.subscriptions.push(vscode.languages.registerOnTypeFormattingEditProvider(HONEYCOMB_SELECTOR, new HoneyCombDocumentFormattingEditProvider(), "\n", ","));
    context.subscriptions.push(vscode.commands.registerCommand("extension.minimize", () => {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor &&
            activeTextEditor.document.languageId === HONEYCOMB_SELECTOR) {
            const { document } = activeTextEditor;
            let text = document.getText();
            const edit = new vscode.WorkspaceEdit();
            let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
            edit.replace(document.uri, fullRange, text.replace(/\s+(?=((\\[\\"]|[^\\"])*"(\\[\\"]|[^\\"])*")*(\\[\\"]|[^\\"])*$)/g, ""));
            return vscode.workspace.applyEdit(edit);
        }
    }));
}
exports.activate = activate;
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
        return text.replace(/\s+(?=((\\[\\"]|[^\\"])*"(\\[\\"]|[^\\"])*")*(\\[\\"]|[^\\"])*$)/g, "");
    }
    format(minifiedtext) {
        let paren = 0;
        let result = "";
        for (var i = 0; i < minifiedtext.length; i++) {
            let charat = minifiedtext[i];
            if (charat == ",") {
                result += charat + "\n" + "\t".repeat(paren);
            }
            else if (charat == "(") {
                paren++;
                result += charat + "\n" + "\t".repeat(paren);
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
}
class HoneyCombItemProvider {
    constructor() {
        this.keys = Array.from(textdefinitions_1.default.keys());
    }
    provideCompletionItems(document, position, token) {
        let range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        var result = [];
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