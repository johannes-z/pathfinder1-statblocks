import type { Monster } from './types'
import { unique } from './utils/unique'

export function mergeMonsters(base: Monster, monster: Monster): Monster {
  const merged = {
    ...base,
    ...monster,
    SpecialAbilities: unique([
      ...(base.SpecialAbilities || []),
      ...(monster.SpecialAbilities || []),
    ], 'name', 'description'),
    SpellLikeAbilities: unique([
      ...(base.SpellLikeAbilities?.values || []),
      ...(monster.SpellLikeAbilities?.values || []),
    ], 'label', 'value'),
    SpellsKnown: unique([
      ...(base.SpellsKnown?.values || []),
      ...(monster.SpellsKnown?.values || []),
    ], 'label', 'value'),
  }

  return merged
}
