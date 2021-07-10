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
  function formatString(minifiedtext: string) {
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
function isError(resp: DerivedColumn | HoneycombError): resp is HoneycombError {
    return (resp as HoneycombError).error !== undefined;
}
  export { minimizeString, formatString, isError }