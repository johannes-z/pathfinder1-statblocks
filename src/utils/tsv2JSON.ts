export function tsv2JSON(csv: string) {
  const lines = csv.split(/\r\n|\n/)

  const result: any[] = []

  const headers = lines[0].split('\t')

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].length === 0)
      continue
    const row: any = {}
    lines[i] = lines[i]
      .replace('&#8211;', '-')
      .replace('</br>', '<br>')
      .replace('&mdash;', '-')
    const currentline = lines[i].split('\t')

    for (let j = 0; j < headers.length; j++) {
      let value: string | number | null = currentline[j].trim()
      if (value === 'NULL')
        value = null
      else if (!Number.isNaN(+value))
        value = +value
      row[headers[j]] = value
    }

    result.push(row)
  }

  return result
}
