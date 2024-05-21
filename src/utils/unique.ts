export function unique(array: any[], key: string, value: string) {
  return array.reduce((acc: { [key: string]: string }, obj) => {
    acc[array[key]] = array[value]
    return acc
  }, {})
}
