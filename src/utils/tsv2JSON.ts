export function tsv2JSON(csv: string) {
  const lines = csv.split(/\r\n|\n/)

  const result: any = []

  const headers = lines[0].split('\t')

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].length === 0)
      continue
    const row: any = {}
    const currentline = lines[i].split('\t')

    for (let j = 0; j < headers.length; j++) {
      const value = currentline[j]
      row[headers[j]] = value.trim()
    }

    result.push(row)
  }

  return result
}
