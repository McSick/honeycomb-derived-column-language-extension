import {
  TextDocument,
  CancellationToken,
  ProviderResult,
  DocumentFormattingEditProvider,
  TextEdit,
  FormattingOptions,
  OnTypeFormattingEditProvider
} from "vscode";
import * as vscode from "vscode";
import { minimizeString, formatString } from '../util/Helpers';
export default class HoneyCombDocumentFormattingEditProvider
  implements DocumentFormattingEditProvider, OnTypeFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: TextDocument,
    options: FormattingOptions,
    token: CancellationToken
  ): ProviderResult<TextEdit[]> {
    var doctext = document.getText();
    let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
    let result: string = "";
    var minifiedtext = minimizeString(doctext);
    result = formatString(minifiedtext);

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
    var minifiedtext = minimizeString(doctext);
    result = formatString(minifiedtext);

    return [TextEdit.replace(fullRange, result)];
  }
}
