import { dump } from 'js-yaml'
import { csv2JSON } from './utils/csv2JSON'
import { kebabize } from './utils/kebabize'

const REGEX_SpecialAbilities = /(?<name>[A-Za-z\s]+?\s?\((Ex|Su|Sp)\))\s(?<description>.*?)(?=\s[A-Za-z\s]+?\s?\((Ex|Su|Sp)\)|$)/gs

async function extractStatblocks(filename, destination) {
  const file = Bun.file(filename)
  const text = await file.text()

  const obj = csv2JSON(text)

  obj.forEach((monster) => {
    const name = (Array.isArray(monster.Name) ? monster.Name.join(' ') : monster.Name)
      .replace(/'/g, '')
    const filename = kebabize(name)
    const target = Bun.file(`${destination}/${filename}.yaml`)

    const sanitized = Object.assign({}, monster)

    sanitized.AbilityScores = monster.AbilityScores.split(/,\s+/g).map(ability => ability.split(' ')[1])
    sanitized.Senses = monster.Senses.split(/;\s+/g)
    sanitized.Melee = monster.Melee.split(/(,\sor\s)/g)
    sanitized.Ranged = monster.Ranged.split(/(,\sor\s)/g)
    sanitized.Feats = monster.Feats.split(/,\s+/g)
    sanitized.Skills = monster.Skills.split(/,\s+/g)
    sanitized.Languages = monster.Languages.split(/[,;]\s+/g)
    sanitized.Description = monster.Description.split(/\s{2,}/g)

    const matches = [...sanitized.SpecialAbilities.matchAll(REGEX_SpecialAbilities)]

    sanitized.SpecialAbilities = matches.map(match => ({
      name: match.groups.name.trim(),
      description: match.groups.description.trim().replace(/\s{2,}/g, ' '), // Remove extra spaces
    }))

    delete sanitized.FullText

    Bun.write(target, dump(sanitized))
  })
}

await extractStatblocks(
  './assets/monster_bestiary_full.tsv',
  './dist/bestiary/monsters',
)
await extractStatblocks(
  './assets/npcs.tsv',
  './dist/bestiary/npcs',
)
