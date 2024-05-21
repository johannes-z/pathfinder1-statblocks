import { dump } from 'js-yaml'
import { tsv2JSON } from './utils/tsv2JSON'
import { kebabize } from './utils/kebabize'
import { unique } from './utils/unique'

const REGEX_SpecialAbilities = /(?<name>[A-Za-z\s]+?\s?\((Ex|Su|Sp)\))\s(?<description>.*?)(?=\s[A-Za-z\s]+?\s?\((Ex|Su|Sp)\)|$)/gs

function mergeMonsters(base: any, monster: any) {
  const merged = {
    ...base,
    ...monster,
    SpecialAbilities: unique([
      ...(base.SpecialAbilities || []),
      ...(monster.SpecialAbilities || []),
    ]),
  }

  return merged
}

function saveMonster(monster: any, destination: string) {
  const name = (Array.isArray(monster.Name) ? monster.Name.join(' ') : monster.Name)
    .replace(/'/g, '')

  const filename = kebabize(name)
  const target = Bun.file(`${destination}/${filename}.yaml`)
  Bun.write(target, dump(monster))
}

async function extractStatblocks(filename: string, destination: string) {
  const file = Bun.file(filename)
  const text = await file.text()

  const monsters = tsv2JSON(text).reduce((monsters: any, monster: any) => {
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
    monsters[monster.Name] = monster

    return monsters
  }, {})

  Object.values(monsters).forEach((monster: any) => {
    saveMonster(monster, destination)
  })

  // post-process step for Group property to merge data with base monster
  Object.values(monsters).filter((monster: any) => monster.Group).forEach((monster: any) => {
    const baseMonster = monsters[monster.Group]
    if (baseMonster == null)
      return

    const merged = mergeMonsters(baseMonster, monster)
    saveMonster(merged, destination)
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
