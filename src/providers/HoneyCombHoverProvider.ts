import {
  TextDocument,
  Position,
  CancellationToken,
  Hover,
  HoverProvider,
  ProviderResult,
  MarkdownString,
} from "vscode";
import DEFINITIONS from "../util/textdefinitions";
export default class HoneyCombHoverProvider implements HoverProvider {
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