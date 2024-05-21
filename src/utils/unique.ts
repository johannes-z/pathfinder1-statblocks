export function unique(array: { name: string, description: string }[]) {
  return array.reduce((acc: { [key: string]: string }, { name, description }) => {
    acc[name] = description
    return acc
  }, {})
}
