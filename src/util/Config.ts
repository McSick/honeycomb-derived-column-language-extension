import * as vscode from "vscode";
export default class Config {
    public static readonly HONEYCOMB_SELECTOR: string = "honeycomb-derived";
    public static get(setting: string) {
        let config = vscode.workspace.getConfiguration(this.HONEYCOMB_SELECTOR);
        if (config && config.hasOwnProperty(setting)) {
            let ret: any = config.get(setting);;
            if (typeof ret === 'string') {
                return ret;
            } else {
                return { ...ret }
            }
        } else {
            return undefined;
        }
    }
    public static set(setting: string, value:any): Thenable<void> {
        let config = vscode.workspace.getConfiguration(this.HONEYCOMB_SELECTOR);
        return config.update(setting, value);

    }
    public static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            // Enable javascript in the webview
            enableScripts: true,
    
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        };
    }
}