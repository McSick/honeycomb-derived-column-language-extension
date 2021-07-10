"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Config {
    static get(setting) {
        let config = vscode.workspace.getConfiguration(this.HONEYCOMB_SELECTOR);
        if (config && config.hasOwnProperty(setting)) {
            let ret = config.get(setting);
            ;
            if (typeof ret === 'string') {
                return ret;
            }
            else {
                return { ...ret };
            }
        }
        else {
            return undefined;
        }
    }
    static set(setting, value) {
        let config = vscode.workspace.getConfiguration(this.HONEYCOMB_SELECTOR);
        return config.update(setting, value);
    }
    static getWebviewOptions(extensionUri) {
        return {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        };
    }
}
exports.default = Config;
Config.HONEYCOMB_SELECTOR = "honeycomb-derived";
//# sourceMappingURL=Config.js.map