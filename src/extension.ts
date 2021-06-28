// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { info } from "console";
import * as vscode from "vscode";

import {
  TextDocument,
  Position,
  CancellationToken,
  Hover,
  ExtensionContext,
  HoverProvider,
  ProviderResult,
  SignatureHelpProvider,
  SignatureHelp,
  SignatureInformation,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  DocumentFormattingEditProvider,
  TextEdit,
  FormattingOptions,
  MarkdownString,
  OnTypeFormattingEditProvider,
} from "vscode";
import DEFINITIONS from "./textdefinitions";
const HONEYCOMB_SELECTOR = "honeycomb-derived";
// const MINIFYREGEX = /\s+(?=((\\[\\"`']|[^\\"^`'])*[`'"](\\[\\"`']|[^\\"^`'])*["'`])*(\\[\\"'`]|[^\\"^`'])*$)/g;

// const regextest = /(?=\S)[^"\s]*(?:"[^\\"]*(?:\\[\s\S][^\\"]*)*"[^"\s]*)*/g;
//REGEX is hard.  For loop FTW
function minimizeString(s: string): string {
  let newstring = "";
  let inside = false;
  let inside_char = "";
  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    if (c == '"' || c == "`") {
      if (!inside) {
        inside = true;
        inside_char = c;
      } else if (inside && inside_char == c) {
        inside = false;
        inside_char = "";
      }
      newstring += c;
      continue;
    } else if (inside) {
      newstring += c;
    } else {
      newstring += c.trim();
    }
  }
  return newstring;
}

// import { workspace, Disposable, ExtensionContext } from 'vscode';
// import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      HONEYCOMB_SELECTOR,
      new HoneyCombHoverProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      HONEYCOMB_SELECTOR,
      new HoneCombSignatureProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      HONEYCOMB_SELECTOR,
      new HoneyCombItemProvider(),
      "\\u0008",
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
      "Z"
    )
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      HONEYCOMB_SELECTOR,
      new HoneyCombDocumentFormattingEditProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerOnTypeFormattingEditProvider(
      HONEYCOMB_SELECTOR,
      new HoneyCombDocumentFormattingEditProvider(),
      "\n",
      ","
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.minimize", () => {
      const { activeTextEditor } = vscode.window;

      if (
        activeTextEditor &&
        activeTextEditor.document.languageId === HONEYCOMB_SELECTOR
      ) {
        const { document } = activeTextEditor;
        let text = document.getText();
        const edit = new vscode.WorkspaceEdit();
        let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
        edit.replace(document.uri, fullRange, minimizeString(text));

        return vscode.workspace.applyEdit(edit);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.pull", () => {
     
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.push", () => {
     
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.delete", () => {
     
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.validate", () => {
     
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.pullall", () => {
     
    })
  );
}
class HoneyCombDocumentFormattingEditProvider
  implements DocumentFormattingEditProvider, OnTypeFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: TextDocument,
    options: FormattingOptions,
    token: CancellationToken
  ): ProviderResult<TextEdit[]> {
    var doctext = document.getText();
    let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    let result: string = "";
    var minifiedtext = this.minifyText(doctext);
    result = this.format(minifiedtext);

    return [TextEdit.replace(fullRange, result)];
  }

  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): ProviderResult<TextEdit[]> {
    var doctext = document.getText();
    let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    let result: string = "";
    var minifiedtext = this.minifyText(doctext);
    result = this.format(minifiedtext);

    return [TextEdit.replace(fullRange, result)];
  }
  private minifyText(text: string): string {
    return minimizeString(text);
  }
  private format(minifiedtext: string) {
    let paren = 0;
    let result = "";
    let inquote = false;
    let inquote_start_chart = "";
    for (var i = 0; i < minifiedtext.length; i++) {
      let charat = minifiedtext[i];
      if (charat == '"' || charat == "`") {
        if (!inquote) {
          inquote = true;
          inquote_start_chart = charat;
        } else if (inquote_start_chart == charat) {
          inquote = false;
          inquote_start_chart = "";
        }
        result += charat;
        continue;
      }
      if (inquote) {
        result += charat;
      } else if (charat == ",") {
        result += charat + "\n" + "\t".repeat(paren);
      } else if (charat == "(") {
        paren++;
        if (i < minifiedtext.length - 1) {
          if (minifiedtext[i + 1] == ")") {
            i++;
            paren--;
            result += charat + ")";
          } else {
            result += charat + "\n" + "\t".repeat(paren);
          }
        } else {
          result += charat + "\n" + "\t".repeat(paren);
        }
      } else if (charat == ")") {
        paren--;
        if (i < minifiedtext.length - 1) {
          if (minifiedtext[i + 1] == ",") {
            result += "\n" + "\t".repeat(paren) + charat + ",\n";
            i++;
            result += "\t".repeat(paren);
          } else {
            result += "\n" + "\t".repeat(paren) + charat;
          }
        } else {
          result += "\n" + "\t".repeat(paren) + charat + "\n";
        }
      } else {
        result += charat;
      }
    }
    return result;
  }
}
class HoneyCombItemProvider implements CompletionItemProvider {
  private keys: string[] = Array.from(DEFINITIONS.keys());
  public provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<CompletionItem[]> {
    let range = document.getWordRangeAtPosition(position);
    const word = document.getText(range);
    var result: CompletionItem[] = [];
    let foundkeys: string[] = this.keys.filter((key) => {
      return key.includes(word);
    });
    if (foundkeys.length > 0) {
      foundkeys.forEach((key: string) => {
        var worddef = DEFINITIONS.get(key);
        var itemdefs = worddef.COMPLETIONITEMS;
        var itemlabels = worddef.COMPLETIONLABELS;
        itemlabels.forEach((item: any, i: number) => {
          var completionitem = new CompletionItem(
            item,
            CompletionItemKind.Function
          );
          completionitem.documentation = new MarkdownString(
            `${worddef.SIGNATURES[0]}   \n\n${worddef.HOVER}`,
            true
          );
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
class HoneyCombHoverProvider implements HoverProvider {
  public provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<Hover> {
    const range = document.getWordRangeAtPosition(position);
    const word = document.getText(range);
    if (DEFINITIONS.has(word)) {
      var def = DEFINITIONS.get(word);
      var hoverdef = def.HOVER;
      var signdef = def.SIGNATURES[0];
      return new Hover(
        new MarkdownString(`${signdef}   \n\n${hoverdef}`, true)
      );
    }
  }
}
class HoneCombSignatureProvider implements SignatureHelpProvider {
  public provideSignatureHelp(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): ProviderResult<SignatureHelp> {
    const range = document.getWordRangeAtPosition(position);
    const word = document.getText(range);
    var result: SignatureInformation[] = [];
    if (DEFINITIONS.has(word)) {
      var itemdefs = DEFINITIONS.get(word).SIGNATURES;
      itemdefs.forEach((item: any) => {
        result.push(
          new SignatureInformation(word, new MarkdownString(item, true))
        );
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
