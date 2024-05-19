export function csv2JSON(csv) {
  const lines = csv.split(/\r\n|\n/)

  const result = []

  const headers = lines[0].split('\t')

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].length === 0)
      continue
    const obj = {}
    const currentline = lines[i].split('\t')

    for (let j = 0; j < headers.length; j++) {
      const value = currentline[j]
      obj[headers[j]] = value.trim()
    }

    result.push(obj)
  }

  return result
}
