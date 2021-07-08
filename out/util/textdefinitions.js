"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFINITIONS = new Map();
DEFINITIONS.set("IF", {
    COMPLETIONLABELS: ["IF(condition,then-val)", "IF(condition,then-val,else)"],
    COMPLETIONITEMS: ["IF(${1:$condition},${2:then-val})", "IF(${1:$condition},${2:then-val},${3:else})"],
    SIGNATURES: ["$(symbol-function)**IF**(condition, then-val [, condition2, then-val2]... [, else-val])"],
    HOVER: "The IF statement takes two or more arguments. Every pair of arguments is evaluated as a condition; the final argument is the default:"
});
DEFINITIONS.set("COALESCE", {
    COMPLETIONITEMS: ["COALESCE(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["COALESCE(arg1,arg2,...)"],
    SIGNATURES: ["$(symbol-function)**COALESCE**(arg1, arg2, ...)"],
    HOVER: "Evaluates to the first non-empty argument"
});
DEFINITIONS.set("LT", {
    COMPLETIONITEMS: ["LT(${1:left},${2:right})"],
    COMPLETIONLABELS: ["LT(left,right)"],
    SIGNATURES: ["$(symbol-function)**LT**(left,right)"],
    HOVER: "If both arguments are numbers, returns true if the first provided value is less than the second. If both arguments are strings, returns true if the first provided value falls lexicographically before the second. Always false if either argument is empty, or if the types of the columns do not match."
});
DEFINITIONS.set("LTE", {
    COMPLETIONITEMS: ["LTE(${1:left},${2:right})"],
    COMPLETIONLABELS: ["LTE(left,right)"],
    SIGNATURES: ["$(symbol-function)**LTE**(left,right)"],
    HOVER: "If both arguments are numbers, returns true if the first provided value is less than or equal to the second. If both arguments are strings, returns true if the first provided value is the same as, or falls lexicographically before, the second. Always false if either argument is empty, or if the types of the columns do not match."
});
DEFINITIONS.set("GT", {
    COMPLETIONITEMS: ["GT(${1:left},${2:right})"],
    COMPLETIONLABELS: ["GT(left,right)"],
    SIGNATURES: ["$(symbol-function)**GT**GT(left,right)"],
    HOVER: "If both arguments are numbers, returns true if the first provided value is greater than the second. If both arguments are strings, returns true if the first provided value falls lexicographically after the second. Always false if either argument is empty, or if the types of the columns do not match."
});
DEFINITIONS.set("GTE", {
    COMPLETIONITEMS: ["GTE(${1:left},${2:right})"],
    COMPLETIONLABELS: ["GTE(left,right"],
    SIGNATURES: ["$(symbol-function)**GTE**(left,right)"],
    HOVER: "If both arguments are numbers, returns true if the first provided value is greater than or equal to the second. If both arguments are strings, returns true if the first provided value is the same as, or falls lexicographically after, the second. Always false if either argument is empty, or if the types of the columns do not match."
});
DEFINITIONS.set("EQUALS", {
    COMPLETIONITEMS: ["EQUALS($1:arg1,${2:arg2})"],
    COMPLETIONLABELS: ["EQUALS(arg1,arg2"],
    SIGNATURES: ["$(symbol-function)**EQUALS**(arg1,arg2)"],
    HOVER: "True if the two provided arguments are equal. (Arguments of different types, such as the integer 200 and the string \"200\", are not considered equal.)"
});
DEFINITIONS.set("IN", {
    COMPLETIONITEMS: ["IN(${1:arg1},${2:compare})"],
    COMPLETIONLABELS: ["IN(arg1, compare,...)"],
    SIGNATURES: ["$(symbol-function)**IN**(arg1, compare1, ...)"],
    HOVER: "True if the first provided argument is equal to any of the subsequent arguments. IN can be thought of as a more compact form of a series of OR equality checks."
});
DEFINITIONS.set("EXISTS", {
    COMPLETIONITEMS: ["EXISTS(${1:arg})"],
    COMPLETIONLABELS: ["EXISTS(arg)"],
    SIGNATURES: ["$(symbol-function)**EXISTS**(arg)"],
    HOVER: "True when the supplied argument has a defined value, false where it does not."
});
DEFINITIONS.set("NOT", {
    COMPLETIONITEMS: ["NOT(${1:arg})"],
    COMPLETIONLABELS: ["NOT(arg)"],
    SIGNATURES: ["$(symbol-function)**NOT**(arg1)"],
    HOVER: "Evaluates the provided argument to a boolean value, then inverts that value."
});
DEFINITIONS.set("AND", {
    COMPLETIONITEMS: ["AND(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["AND(arg1,arg2,...)"],
    SIGNATURES: ["$(symbol-function)**AND**(arg1, arg2, ...)"],
    HOVER: "Takes a variable number of arguments and returns true if all arguments are truthy."
});
DEFINITIONS.set("OR", {
    COMPLETIONITEMS: ["OR(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["OR(arg1,arg2, ...)"],
    SIGNATURES: ["$(symbol-function)**OR**(arg1, arg2, ...)"],
    HOVER: "Takes a variable number of arguments and returns true if any arguments are truthy."
});
DEFINITIONS.set("MIN", {
    COMPLETIONITEMS: ["MIN(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["MIN(arg1,arg2, ...)"],
    SIGNATURES: ["$(symbol-function)**MIN**(arg1, arg2, ...)"],
    HOVER: "Evaluates to the smallest argument of the same type as the first non-empty argument. “Smallest” means the smaller, if numeric, or lexicographically first, if a string."
});
DEFINITIONS.set("MAX", {
    COMPLETIONITEMS: ["MAX(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["MAX(arg1,arg2, ...)"],
    SIGNATURES: ["$(symbol-function)**MAX**(arg1, arg2, ...)"],
    HOVER: "Evaluates to the largest argument of the same type as the first non-empty argument. “Largest” means the larger, if numeric, or lexicographically last, if string."
});
DEFINITIONS.set("SUM", {
    COMPLETIONITEMS: ["SUM(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["SUM(arg1,arg2,...)"],
    SIGNATURES: ["$(symbol-function)**SUM**(arg1, arg2, ...)"],
    HOVER: "Evaluates to the sum of all numeric arguments. Strings are parsed into numbers if possible, unparseable strings or other values evaluate to zero."
});
DEFINITIONS.set("SUB", {
    COMPLETIONITEMS: ["SUB(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["SUB(arg1,arg2)"],
    SIGNATURES: ["$(symbol-function)**SUB**(arg1, arg2)"],
    HOVER: "Evaluates to the first argument subtracted by the second, or arg1 - arg2. Strings are parsed into numbers if possible, unparseable strings or other values evaluate to zero."
});
DEFINITIONS.set("MUL", {
    COMPLETIONITEMS: ["MUL(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["MUL(arg1,arg2, ...)"],
    SIGNATURES: ["$(symbol-function)**MUL**(arg1, arg2, ...)"],
    HOVER: "Evaluates to the product of all numeric arguments. Strings are parsed into numbers if possible, unparseable strings or other values evaluate to zero."
});
DEFINITIONS.set("DIV", {
    COMPLETIONITEMS: ["DIV(${1:arg1},${2:arg2})"],
    COMPLETIONLABELS: ["DIV(arg1,arg2)"],
    SIGNATURES: ["$(symbol-function)**DIV**(arg1, arg2)"],
    HOVER: "Divides the first argument by the second, or arg1 / arg2. Strings are parsed into numbers if possible, unparseable strings or other values evaluate to zero. A division by zero evaluates to null."
});
DEFINITIONS.set("LOG10", {
    COMPLETIONITEMS: ["LOG10(${1:arg})"],
    COMPLETIONLABELS: ["LOG10(arg)"],
    SIGNATURES: ["$(symbol-function)**LOG10**(arg1)"],
    HOVER: "Computes the base-10 logarithm of the argument. Strings are parsed into numbers if possible. Unparseable strings, and arguments less than or equal to 0, evaluate to null."
});
DEFINITIONS.set("BUCKET", {
    COMPLETIONITEMS: ["BUCKET(${1:column},${2:size})", "BUCKET(${1:column},${2:size},${3:min})", "BUCKET(${1:column},${2:size},${3:min},${4:max})"],
    COMPLETIONLABELS: ["BUCKET($column, size)", "BUCKET($column, size, min)", "BUCKET($column, size, min, max)"],
    SIGNATURES: ["$(symbol-function)**BUCKET**( $column, size, [min, [max]])"],
    HOVER: "Computes discrete (categorical) bins, or buckets, to transform continuous fields into categorical ones. This can be useful to group data into groups. The syntax is BUCKET( $column, size, [min, [max]]). The function returns size-sized buckets from min to max. For example, BUCKET( $column, 10, 0, 30) will return groups named < 0, 0 - 10, 10 - 20, 20 - 30, and > 30.  \nIf only the min is specified, then the function will run without an upper bound; if neither a min nor max is specified, then the function will run without either bound, starting from a bucket 0 - size.  \n  \nIn all versions, points on the boundary between two bins will fall into the lower bin. The size, min, and max may not be columns. If the column is not a float value, the function returns null."
});
DEFINITIONS.set("INT", {
    COMPLETIONITEMS: ["INT(${1:arg})"],
    COMPLETIONLABELS: ["INT(arg)"],
    SIGNATURES: ["$(symbol-function)**INT**(arg)"],
    HOVER: "Casts the argument to an integer, truncating the value if necessary. The argument is first coerced to a float if possible. Non-numeric values return 0."
});
DEFINITIONS.set("FLOAT", {
    COMPLETIONITEMS: ["FLOAT(${1:arg})"],
    COMPLETIONLABELS: ["FLOAT(arg)"],
    SIGNATURES: ["$(symbol-function)**FLOAT**(arg)"],
    HOVER: "Casts the argument to an float. Non-numeric values return 0.0."
});
DEFINITIONS.set("BOOL", {
    COMPLETIONITEMS: ["BOOL(${1:arg})"],
    COMPLETIONLABELS: ["BOOL(arg)"],
    SIGNATURES: ["$(symbol-function)**BOOL**(arg)"],
    HOVER: "Casts the argument to a bool. Evaluates to true if the argument is truthy",
});
DEFINITIONS.set("STRING", {
    COMPLETIONITEMS: ["STRING(${1:arg})"],
    COMPLETIONLABELS: ["STRING(arg)"],
    SIGNATURES: ["$(symbol-function)**STRING**(arg1)"],
    HOVER: "Casts the argument to a string. Empty arguments are converted to \"\"."
});
DEFINITIONS.set("CONCAT", {
    COMPLETIONITEMS: ["CONCAT($1{arg1},${2:arg2})"],
    COMPLETIONLABELS: ["CONCAT(arg1,arg2, ...)"],
    SIGNATURES: ["$(symbol-function)**CONCAT**(arg1, arg2, ...)"],
    HOVER: "Concatenates string representations of all arguments into a single string result. Non-string arguments are converted to strings, empty arguments are ignored."
});
DEFINITIONS.set("STARTS_WITH", {
    COMPLETIONITEMS: ["STARTS_WITH(${1:string},${2:prefix})"],
    COMPLETIONLABELS: ["STARTS_WITH(string, prefix)"],
    SIGNATURES: ["$(symbol-function)**STARTS_WITH**(string, prefix)"],
    HOVER: "True if the first argument starts with the second argument. False if either argument is not a string."
});
DEFINITIONS.set("CONTAINS", {
    COMPLETIONITEMS: ["CONTAINS(${1:string},${2:substr})"],
    COMPLETIONLABELS: ["CONTAINS(string, substr)"],
    SIGNATURES: ["$(symbol-function)**CONTAINS**(string, substr)"],
    HOVER: "True if the first argument contains the second argument. False if either argument is not a string."
});
DEFINITIONS.set("REG_MATCH", {
    COMPLETIONITEMS: ["REG_MATCH(${1:string},${2:regex})"],
    COMPLETIONLABELS: ["REG_MATCH(string, regex)"],
    SIGNATURES: ["$(symbol-function)**REG_MATCH**(string, regex)"],
    HOVER: "True if the first argument matches the second argument, which must be a defined Golang regular expression. False if the first argument is not a string or is empty. The provided regex must be a string literal containing a valid regular expression."
});
DEFINITIONS.set("REG_VALUE", {
    COMPLETIONITEMS: ["REG_VALUE(${1:string},${2:regex})"],
    COMPLETIONLABELS: ["REG_VALUE(string, regex)"],
    SIGNATURES: ["$(symbol-function)**REG_VALUE**(string, regex)"],
    HOVER: "Evaluates to the first Golang regex submatch found in the first argument. Evaluates to an empty value if the first argument contains no matches or is not a string. The provided regex must be a string literal containing a valid regular expression."
});
DEFINITIONS.set("REG_COUNT", {
    COMPLETIONITEMS: ["REG_COUNT(${1:string},${2:regex})"],
    COMPLETIONLABELS: ["REG_COUNT(string, regex)"],
    SIGNATURES: ["$(symbol-function)**REG_COUNT**(string, regex)"],
    HOVER: "Returns the number of non-overlapping successive matches yielded by the provided Golang regex. Returns 0 if the first argument contains no matches or is not a string. The provided regex must be a string literal containing a valid regular expression."
});
DEFINITIONS.set("UNIX_TIMESTAMP", {
    COMPLETIONITEMS: ["UNIX_TIMESTAMP()"],
    COMPLETIONLABELS: ["UNIX_TIMESTAMP()"],
    SIGNATURES: ["$(symbol-function)**UNIX_TIMESTAMP**()"],
    HOVER: "Converts a date string in RFC3339 format (e.g., 2017-07-20T11:22:44.888Z) to a Unix timestamp (1500549764.888). This is useful for comparing two timestamps in an event; for example, to calculate a duration from a start and an end timestamp."
});
DEFINITIONS.set("EVENT_TIMESTAMP", {
    COMPLETIONITEMS: ["EVENT_TIMESTAMP()"],
    COMPLETIONLABELS: ["EVENT_TIMESTAMP()"],
    SIGNATURES: ["$(symbol-function)**EVENT_TIMESTAMP**()"],
    HOVER: "Returns the Unix timestamp field of the current event (e.g. 1500549764). This is useful for comparing two timestamps in an event; for example, to calculate a duration from a start and an end timestamp. This function takes no arguments."
});
exports.default = DEFINITIONS;
//# sourceMappingURL=textdefinitions.js.map