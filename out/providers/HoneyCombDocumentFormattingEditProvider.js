"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode = require("vscode");
const Helpers_1 = require("../util/Helpers");
class HoneyCombDocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document, options, token) {
        var doctext = document.getText();
        let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
        let result = "";
        var minifiedtext = Helpers_1.minimizeString(doctext);
        result = Helpers_1.formatString(minifiedtext);
        return [vscode_1.TextEdit.replace(fullRange, result)];
    }
    provideOnTypeFormattingEdits(document, position, ch, options, token) {
        var doctext = document.getText();
        let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
        let result = "";
        var minifiedtext = Helpers_1.minimizeString(doctext);
        result = Helpers_1.formatString(minifiedtext);
        return [vscode_1.TextEdit.replace(fullRange, result)];
    }
}
exports.default = HoneyCombDocumentFormattingEditProvider;
//# sourceMappingURL=HoneyCombDocumentFormattingEditProvider.js.map