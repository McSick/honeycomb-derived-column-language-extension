"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const textdefinitions_1 = require("../util/textdefinitions");
class HoneyCombSignatureProvider {
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
exports.default = HoneyCombSignatureProvider;
//# sourceMappingURL=HoneyCombSignatureProvider.js.map