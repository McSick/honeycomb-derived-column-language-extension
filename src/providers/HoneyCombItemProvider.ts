import {
  TextDocument,
  Position,
  CancellationToken,
  ProviderResult,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  MarkdownString,
} from "vscode";
import * as vscode from "vscode";
import Config from "../util/Config";
import DEFINITIONS from "../util/textdefinitions";

export default class HoneyCombItemProvider implements CompletionItemProvider {
    private keys: string[] = Array.from(DEFINITIONS.keys());
    public provideCompletionItems(
      document: TextDocument,
      position: Position,
      token: CancellationToken
    ): ProviderResult<CompletionItem[]> {
      let fsPath = document.fileName;
  
      let patharr = fsPath.split("/");
      let alias = patharr[patharr.length - 1].split(".")[0];
      let dataset = patharr[patharr.length - 2];

  
  
      let range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      var result: CompletionItem[] = [];
      let dataset_settings = Config.get("dataset_settings")
      if(dataset_settings[dataset]) {
        
        let cols = dataset_settings[dataset].columns;
        cols.forEach((col: any) => {
  
          if (col.key_name.includes(word)) {
            var completionitem = new CompletionItem(
              col.key_name,
              CompletionItemKind.Variable
            );
            completionitem.documentation = new MarkdownString(
              `${col.key_name}:${col.type}   \n\n${col.description}`,
              true
            );
            if (col.key_name.includes(" ")) {
              completionitem.insertText = `$"${col.key_name}"`;
            } else {
              completionitem.insertText = `$${col.key_name}`;
            }
            
    
            result.push(completionitem);
          }
  
        })
      }
  
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