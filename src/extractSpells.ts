/**
 * Each entry in the spell known or spell like abilities section starts with the spell level and quantifier how often it can be used.
 *
 * @example
 * ```txt
 * 1st 3/day-Cure Light Wounds
 * 0 (at will)-Detect magic, light
 * ```
 */
const SPELL_DEFINITIONS = ['[(]?\\d+\\/day[)]?', '[(]?\\d+\\/hour[)]?', 'Constant', '[(]?At Will[)]?']
const SPELL_DEFINITIONS_LEVEL = ['9th', '8th', '7th', '6th', '5th', '4th', '3rd', '2nd', '1st', '0']

/**
 * Extracts all entries in the spell section. The beginning of an entry is
 * marked by how often the spell can be used. Optionally, the quantifier can be
 * preceeded by the spell level.
 */
const REGEX_SpellLikeAbilities = new RegExp(`(?<label>(${SPELL_DEFINITIONS_LEVEL.join('|')})?\\s+(${SPELL_DEFINITIONS.join('|')}))[- ](?<value>.*?)\\s*(?=((${SPELL_DEFINITIONS_LEVEL.join('|')})?\\s+(${SPELL_DEFINITIONS.join('|')}))[- ]|$)`, 'gi')
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
const REGEX_SpellLikeAbilities_Header = new RegExp(`^(?<header>.+?)\\s*((?=(?:(${SPELL_DEFINITIONS_LEVEL.join('|')})?\\s*${SPELL_DEFINITIONS.join('|')})[- ])|$)`, 'i')

export function extractSpells(monster: any, column: string) {
  const header = monster[column].match(REGEX_SpellLikeAbilities_Header)
  const matches = [...monster[column].matchAll(REGEX_SpellLikeAbilities)]
  monster[column] = {
    header: header.groups.header.trim(),
    values: matches.map(match => ({
      label: match.groups.label.trim(),
      value: match.groups.value.trim().replace(/\s{2,}/g, ' '), // Remove extra spaces
    })),
  }
}
