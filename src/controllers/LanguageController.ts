import * as vscode from "vscode";
import Config from "../util/Config";
import { minimizeString, formatString } from "../util/Helpers";
export default class LanguageController {
  public static minimize() {
    const { activeTextEditor } = vscode.window;

    if (
      activeTextEditor &&
      activeTextEditor.document.languageId === Config.HONEYCOMB_SELECTOR
    ) {
      const { document } = activeTextEditor;
      let text = document.getText();
      const edit = new vscode.WorkspaceEdit();
      let fullRange = new vscode.Range(0, 0, document.lineCount, 0);
      edit.replace(document.uri, fullRange, minimizeString(text));

      return vscode.workspace.applyEdit(edit);
    }
  }
  public static format() {

  }
    

}