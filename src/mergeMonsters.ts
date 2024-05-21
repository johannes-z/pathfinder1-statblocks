import { unique } from './utils/unique'

export function mergeMonsters(base: any, monster: any) {
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
      ...(base.SpellsKnown?.value || []),
      ...(monster.SpellsKnown?.value || []),
    ], 'label', 'value'),
  }

  return merged
}
