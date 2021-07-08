import {
  TextDocument,
  Position,
  CancellationToken,
  ProviderResult,
  SignatureHelpProvider,
  SignatureHelp,
  SignatureInformation,
  MarkdownString,
} from "vscode";
import DEFINITIONS from "../util/textdefinitions";
export default class HoneyCombSignatureProvider implements SignatureHelpProvider {
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