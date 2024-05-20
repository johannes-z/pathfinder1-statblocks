import { dump } from 'js-yaml'
import { tsv2JSON } from './utils/tsv2JSON'
import { kebabize } from './utils/kebabize'

const REGEX_SpecialAbilities = /(?<name>[A-Za-z\s]+?\s?\((Ex|Su|Sp)\))\s(?<description>.*?)(?=\s[A-Za-z\s]+?\s?\((Ex|Su|Sp)\)|$)/gs

async function extractStatblocks(filename: string, destination: string) {
  const file = Bun.file(filename)
  const text = await file.text()

  const obj = tsv2JSON(text)

  obj.forEach((monster: any) => {
    const name = (Array.isArray(monster.Name) ? monster.Name.join(' ') : monster.Name)
      .replace(/'/g, '')

    delete monster.FullText
    for (const key in monster) {
      if (!monster[key])
        delete monster[key]
    }
    monster.AbilityScores = monster.AbilityScores
      ?.split(/,\s+/g)
      .map((ability: string) => {
        const value = ability.split(' ')[1]
        return value === '-' ? '—' : +value
      })
    monster.Senses = monster.Senses?.split(/;\s+/g)
    monster.Melee = monster.Melee?.split(/\s+or\s{2,}/g)
    monster.Ranged = monster.Ranged?.split(/\s+or\s{2,}/g)
    monster.Feats = monster.Feats?.split(/,\s+/g)
    monster.Skills = monster.Skills?.split(/,\s+/g)
    monster.Languages = monster.Languages?.split(/[,;]\s+/g)
    monster.Description = monster.Description?.split(/\s{2,}/g)

    if (monster.SpecialAbilities) {
      const matches = [...monster.SpecialAbilities.matchAll(REGEX_SpecialAbilities)]

      monster.SpecialAbilities = matches.map(match => ({
        name: match.groups.name.trim(),
        description: match.groups.description.trim().replace(/\s{2,}/g, ' '), // Remove extra spaces
      }))
    }

    const filename = kebabize(name)
    const target = Bun.file(`${destination}/${filename}.yaml`)
    Bun.write(target, dump(monster))
  })
}

await extractStatblocks(
  './assets/monster_bestiary_full.tsv',
  './public/bestiary/monsters',
)
await extractStatblocks(
  './assets/npcs.tsv',
  './public/bestiary/npcs',
)
