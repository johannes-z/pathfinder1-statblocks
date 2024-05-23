import { dump } from 'js-yaml'
import { tsv2JSON } from './utils/tsv2JSON'
import { kebabize } from './utils/kebabize'
import { extractSpecialAbilities } from './extractSpecialAbilities'
import { extractSpells } from './extractSpells'
import { mergeMonsters } from './mergeMonsters'
import type { Monster, MonsterRaw } from './types'

function saveMonster(filename: string, monster: Monster, destination: string) {
  const target = Bun.file(`${destination}/${filename}.yaml`)
  Bun.write(target, dump(monster))
}

function sanitizeMonster(_monster: MonsterRaw): Monster {
  delete _monster.FullText
  for (const key in _monster) {
    if (!_monster[key])
      delete _monster[key]
  }
  const monster: Monster = { ..._monster }

  monster.AbilityScores = _monster.AbilityScores
    ?.split(/,\s+/g)
    .map((ability: string) => {
      const value = ability.split(' ')[1]
      return value === '-' ? null : +value
    })
  monster.Senses = _monster.Senses?.split(/;\s+/g)
  monster.Melee = _monster.Melee?.split(/,*\s+or\s+/g).map(value => value.replace(/\s{2,}/g, ' '))
  monster.Ranged = _monster.Ranged?.split(/,*\s+or\s+/g).map(value => value.replace(/\s{2,}/g, ' '))
  monster.Feats = _monster.Feats?.split(/,\s+/g)
  monster.Skills = _monster.Skills?.split(/,\s+/g)
  monster.Languages = _monster.Languages?.split(/[,;]\s+/g)
  monster.Description = _monster.Description?.split(/\s{2,}/g)

  if (_monster.SpecialAbilities)
    monster.SpecialAbilities = extractSpecialAbilities(_monster)

  if (_monster.SpellLikeAbilities)
    monster.SpellLikeAbilities = extractSpells(_monster, 'SpellLikeAbilities')

  if (_monster.SpellsKnown)
    monster.SpellsKnown = extractSpells(_monster, 'SpellsKnown')

  return monster
}

async function extractStatblocks(filename: string, destination: string) {
  const file = Bun.file(filename)
  const contents = await file.text()

  const monsters: { [key: string]: Monster[] } = tsv2JSON(contents).reduce((monsters, _monster: MonsterRaw) => {
    const monster = sanitizeMonster(_monster)
    if (!monsters[monster.Name])
      monsters[monster.Name] = []
    monsters[monster.Name].push(monster)
    return monsters
  }, {})

  Object.entries(monsters).forEach(([key, monsters]) => {
    monsters.forEach((monster) => {
      const name = (Array.isArray(monster.Name) ? monster.Name.join(' ') : monster.Name)
        .replace(/'/g, '')

      saveMonster(
        monsters.length === 1 ? kebabize(name) : `${kebabize(name)}_${monster.id}`,
        monster,
        destination,
      )
    })
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
