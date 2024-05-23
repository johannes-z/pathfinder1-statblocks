import type { Monster } from './types'
import { unique } from './utils/unique'

export function mergeMonsters(base: Monster, monster: Monster): Monster {
  console.log(base.Name)
  const merged = {
    ...base,
    ...monster,
    SpecialAbilities: [
      ...(base.SpecialAbilities || []),
      ...(monster.SpecialAbilities || []),
    ],
    SpellLikeAbilities: {
      ...monster.SpellLikeAbilities,
      values: unique([
        ...(base.SpellLikeAbilities?.values || []),
        ...(monster.SpellLikeAbilities?.values || []),
      ], 'label', 'value'),
    },
    SpellsKnown: {
      ...monster.SpellsKnown,
      values: unique([
        ...(base.SpellsKnown?.values || []),
        ...(monster.SpellsKnown?.values || []),
      ], 'label', 'value'),
    },
    SpellsPrepared: {
      ...monster.SpellsPrepared,
      values: unique([
        ...(base.SpellsPrepared?.values || []),
        ...(monster.SpellsPrepared?.values || []),
      ], 'label', 'value'),
    },
  }

  return merged
}
