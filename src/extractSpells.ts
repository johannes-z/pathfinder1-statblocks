import type { Monster, MonsterRaw, SpellLikeAbilities, SpellLikeAbility } from './types'

/**
 * Each entry in the spell known or spell like abilities section starts with the spell level and quantifier how often it can be used.
 *
 * @example
 * ```txt
 * 1st 3/day-Cure Light Wounds
 * 0 (at will)-Detect magic, light
 * ```
 */
const SPELL_DEFINITIONS = ['\\(?\\d+\\/week\\)?', '\\(?\\d+\\/day\\)?', '\\(?\\d+\\/hour\\)?', 'Constant', '\\(?At Will\\)?']
const SPELL_DEFINITIONS_LEVEL = ['9th', '8th', '7th', '6th', '5th', '4th', '3rd', '2nd', '1st', '0']

const SPELL_DEFINITION = `((${SPELL_DEFINITIONS_LEVEL.join('|')})?\\s*(${SPELL_DEFINITIONS.join('|')}))`

/**
 * Extracts all entries in the spell section. The beginning of an entry is
 * marked by how often the spell can be used. Optionally, the quantifier can be
 * preceeded by the spell level.
 */
// eslint-disable-next-line regexp/no-super-linear-backtracking
const REGEX_SpellLikeAbilities = new RegExp(`(?<label>${SPELL_DEFINITION})[- ](?<value>.*?)\\s*(?=(${SPELL_DEFINITION})[- ]|$)`, 'gi')
/**
 * The entries in the spell section are preceeded by a header. This regex
 * extracts the header and terminates the header by using a positive lookahead.
 * The lookahead finds the beginning of an entry.
 *
 * There is an edge case where the column only contains the header and no entries.
 *
 * @example
 * ```txt
 * Sorcerer Spells Known (CL 9th; concentration +13) 1st (6/day)-Mage Armor, Magic Missile
 * Result: "Sorcerer Spells Known (CL 9th; concentration +13)"
 * ```
 */
// eslint-disable-next-line regexp/no-super-linear-backtracking
const REGEX_SpellLikeAbilities_Header = new RegExp(`^(?<header>.+?)\\s*(?=(${SPELL_DEFINITION}[- ])|$)`, 'i')

export function extractSpells(monster: MonsterRaw, column: 'SpellsKnown' | 'SpellLikeAbilities' | 'SpellsPrepared'): SpellLikeAbilities {
  const header = monster[column].match(REGEX_SpellLikeAbilities_Header)
  const matches = [...monster[column].matchAll(REGEX_SpellLikeAbilities)]

  return {
    header: header?.groups?.header.trim() ?? '',
    values: matches.map(match => ({
      label: match.groups?.label.trim() ?? '',
      value: match.groups?.value.trim().replace(/\s{2,}/g, ' ') ?? '',
    })),
  }
}
