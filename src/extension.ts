// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import HoneycombAPI from "./util/HoneycombAPI";
import HoneyCombDocumentFormattingEditProvider from "./providers/HoneyCombDocumentFormattingEditProvider";
import HoneyCombHoverProvider from "./providers/HoneyCombHoverProvider";
import HoneyCombItemProvider from "./providers/HoneyCombItemProvider";
import HoneyCombSignatureProvider from "./providers/HoneyCombSignatureProvider";
import HoneycombResultPanel from "./panels/HoneycombResultPanel";
import HoneycombController from "./controllers/HoneycombController";
import LanguageController from "./controllers/LanguageController";
import { ExtensionContext } from "vscode";
import Config from "./util/Config";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "HoneycombResult.show",
      (table: string, dataset: string, resultid: string) => {
        HoneycombResultPanel.createOrShow(
          context.extensionUri,
          table,
          dataset,
          resultid
        );
      }
    )
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(
      HoneycombResultPanel.viewType,
      {
        async deserializeWebviewPanel(
          webviewPanel: vscode.WebviewPanel,
          state: any
        ) {
          // Reset the webview options so we use latest uri for `localResourceRoots`.
          webviewPanel.webview.options = Config.getWebviewOptions(
            context.extensionUri
          );
          HoneycombResultPanel.revive(
            webviewPanel,
            context.extensionUri,
            "",
            "",
            ""
          );
        },
      }
    );
  }
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      Config.HONEYCOMB_SELECTOR,
      new HoneyCombHoverProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      Config.HONEYCOMB_SELECTOR,
      new HoneyCombSignatureProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      Config.HONEYCOMB_SELECTOR,
      new HoneyCombItemProvider(),
      "\\u0008",
      "$",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    )
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      Config.HONEYCOMB_SELECTOR,
      new HoneyCombDocumentFormattingEditProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      Config.HONEYCOMB_SELECTOR,
      new HoneyCombDocumentFormattingEditProvider(),
      ",",
      "(",
      ")"
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.minimize",
      LanguageController.minimize
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.query",
      HoneycombController.query
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.pull", HoneycombController.pull)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.push", HoneycombController.push)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.delete",
      HoneycombController.delete
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.validate",
      (uri: vscode.Uri) => {}
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.pullall",
      HoneycombController.pullAll
    )
  );
}
