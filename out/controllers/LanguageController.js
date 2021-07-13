"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Config_1 = require("../util/Config");
const Helpers_1 = require("../util/Helpers");
class LanguageController {
    static minimize() {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor &&
            activeTextEditor.document.languageId === Config_1.default.HONEYCOMB_SELECTOR) {
            const { document } = activeTextEditor;
            let text = document.getText();
            const edit = new vscode.WorkspaceEdit();
            let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
            edit.replace(document.uri, fullRange, Helpers_1.minimizeString(text));
            return vscode.workspace.applyEdit(edit);
        }
    }
    static format() {
    }
}
exports.default = LanguageController;
//# sourceMappingURL=LanguageController.js.map