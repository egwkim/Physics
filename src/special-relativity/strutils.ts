declare global {
  interface String {
    toCamelCase(): string;
    toPascalCase(): string;
    toKebabCase(): string;
  }
}

String.prototype.toCamelCase = function () {
  let camelStr = this.replace(/\s(.)/g, function (match) {
    return match.toUpperCase();
  });
  camelStr = camelStr.replace(/\s/g, '');
  camelStr = camelStr.replace(/^(.)/, function (match) {
    return match.toLowerCase();
  });
  return camelStr;
};

String.prototype.toPascalCase = function () {
  let camelStr = this.replace(/\s(.)/g, function (match) {
    return match.toUpperCase();
  });
  camelStr = camelStr.replace(/\s/g, '');
  camelStr = camelStr.replace(/^(.)/, function (match) {
    return match.toUpperCase();
  });
  return camelStr;
};

String.prototype.toKebabCase = function () {
  let kebabStr = this.replace(/\s/g, '-');
  return kebabStr;
};

export {};
