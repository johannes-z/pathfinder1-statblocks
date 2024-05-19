export function kebabize(str) {
  return str
    && str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
      .map(x => x.toLowerCase())
      .join('-')
}
