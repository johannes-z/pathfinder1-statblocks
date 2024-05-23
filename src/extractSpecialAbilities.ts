import type { Monster, MonsterRaw, SpecialAbility } from './types'

/**
 * Matches the name of a special ability.
 */
const SPECIAL_ABILITY = '[A-Za-z\\s]+?\\s?\\((Ex|Su|Sp)\\)'
/**
 * Looks for `SPECIAL_ABILITY` followed by a description. The description either
 * ends if a new special ability starts or if the string ends.the name of the
 * special ability is always preceeded by a period and a space.
 *
 * @example
 * // Input:
 * // Cool Ability (Ex) This text describes my Cool Ability.
 * // Result:
 * {
 *  "name": "Cool Ability (Ex)",
 *  "description": "This text describes my Cool Ability."
 * }
 */
const REGEX_SpecialAbilities = new RegExp(`(?<name>${SPECIAL_ABILITY})\\s(?<description>.*?)(?=\\s${SPECIAL_ABILITY}|$)`, 'gs')

export function extractSpecialAbilities(monster: MonsterRaw): SpecialAbility[] {
  const matches = [...monster.SpecialAbilities.matchAll(REGEX_SpecialAbilities)]

  return matches.map(match => ({
    name: match.groups?.name.trim() ?? '',
    description: match.groups?.description.trim().replace(/\s{2,}/g, ' ') ?? '', // Remove extra spaces
  }))
}
