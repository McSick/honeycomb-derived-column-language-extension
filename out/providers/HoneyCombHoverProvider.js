"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const textdefinitions_1 = require("../util/textdefinitions");
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
exports.default = HoneyCombHoverProvider;
//# sourceMappingURL=HoneyCombHoverProvider.js.map