// function that takes and array of objects and a string parameter that is the key of the object. the function returns the array of objects with unique values for the key parameter.
export function unique<T>(array: T[], key: keyof T, key2?: keyof T): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const value = key2 ? `${item[key]}${item[key2]}` : item[key]
    return seen.has(value) ? false : seen.add(value)
  })
}
