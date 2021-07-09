"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const HoneyCombDocumentFormattingEditProvider_1 = require("./providers/HoneyCombDocumentFormattingEditProvider");
const HoneyCombHoverProvider_1 = require("./providers/HoneyCombHoverProvider");
const HoneyCombItemProvider_1 = require("./providers/HoneyCombItemProvider");
const HoneyCombSignatureProvider_1 = require("./providers/HoneyCombSignatureProvider");
const HoneycombResultPanel_1 = require("./panels/HoneycombResultPanel");
const HoneycombController_1 = require("./controllers/HoneycombController");
const LanguageController_1 = require("./controllers/LanguageController");
const Config_1 = require("./util/Config");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("HoneycombResult.show", (table, dataset, resultid) => {
        HoneycombResultPanel_1.default.createOrShow(context.extensionUri, table, dataset, resultid);
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(HoneycombResultPanel_1.default.viewType, {
            async deserializeWebviewPanel(webviewPanel, state) {
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = Config_1.default.getWebviewOptions(context.extensionUri);
                HoneycombResultPanel_1.default.revive(webviewPanel, context.extensionUri, "", "", "");
            },
        });
    }
    context.subscriptions.push(vscode.languages.registerHoverProvider(Config_1.default.HONEYCOMB_SELECTOR, new HoneyCombHoverProvider_1.default()));
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(Config_1.default.HONEYCOMB_SELECTOR, new HoneyCombSignatureProvider_1.default()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(Config_1.default.HONEYCOMB_SELECTOR, new HoneyCombItemProvider_1.default(), "\\u0008", "$", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(Config_1.default.HONEYCOMB_SELECTOR, new HoneyCombDocumentFormattingEditProvider_1.default()));
    context.subscriptions.push(vscode.languages.registerOnTypeFormattingEditProvider(Config_1.default.HONEYCOMB_SELECTOR, new HoneyCombDocumentFormattingEditProvider_1.default(), ",", "(", ")"));
    context.subscriptions.push(vscode.commands.registerCommand("extension.minimize", LanguageController_1.default.minimize));
    context.subscriptions.push(vscode.commands.registerCommand("extension.query", HoneycombController_1.default.query));
    context.subscriptions.push(vscode.commands.registerCommand("extension.pull", HoneycombController_1.default.pull));
    context.subscriptions.push(vscode.commands.registerCommand("extension.push", HoneycombController_1.default.push));
    context.subscriptions.push(vscode.commands.registerCommand("extension.delete", HoneycombController_1.default.delete));
    context.subscriptions.push(vscode.commands.registerCommand("extension.validate", (uri) => { }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.pullall", HoneycombController_1.default.pullAll));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map