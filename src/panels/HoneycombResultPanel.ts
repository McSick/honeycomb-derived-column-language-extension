import * as vscode from "vscode";
import Config from '../util/Config';
/**
 * Manages Honeycomb Result webview panels
 */
export default class HoneycombResultPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: HoneycombResultPanel | undefined;

	public static readonly viewType = 'HoneycombResult';
	public static _table: string;
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, table: string, dataset: string, resultid: string) {

		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (HoneycombResultPanel.currentPanel) {
			HoneycombResultPanel.currentPanel.setTable(table, dataset, resultid);
			HoneycombResultPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			HoneycombResultPanel.viewType,
			'Honeycomb Result',
			column || vscode.ViewColumn.One,
			Config.getWebviewOptions(extensionUri),
		);

		HoneycombResultPanel.currentPanel = new HoneycombResultPanel(panel, extensionUri, table, dataset, resultid);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, table: string, dataset: string, resultid: string) {
		HoneycombResultPanel.currentPanel = new HoneycombResultPanel(panel, extensionUri, table, dataset, resultid);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, table: string, dataset: string, resultid: string) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update(table, dataset, resultid);

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update(undefined, undefined, undefined);
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}
	public setTable(table: string, dataset: string, resultid: string) {
		this._update(table, dataset, resultid);
	}

	public dispose() {
		HoneycombResultPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update(table?: string, dataset?: string, resultid?: string) {
		if (table && dataset && resultid) {
			const webview = this._panel.webview;
			this._panel.title = 'Honeycomb Results'
			this._panel.webview.html = this._getHtmlForWebview(webview, table, dataset, resultid);
		}

	}

	private _getHtmlForWebview(webview: vscode.Webview, resulttable: string, dataset: string, resultid: string) {
		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

		// Local path to css styles
		const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
		const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
		const teamslug = Config.get('team');
		let teamurl = ''
		if (teamslug) {
			teamurl = `<a href="https://ui.honeycomb.io/${teamslug}/datasets/${dataset}/result/${resultid}">View in Honeycomb</a>`
		}
		// Uri to load styles into webview
		const stylesResetUri = webview.asWebviewUri(styleResetPath);
		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
				<title>Honeycomb Result</title>
			</head>
			<body>
      <h1 >Last 2 Hours Count</h1>
				<table>
          ${resulttable}
        </table>
      <p>*Only displaying the top 10 results</p><br/>
      <p>${teamurl}</p>

			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}