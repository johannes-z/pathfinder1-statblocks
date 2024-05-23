export interface Monster {
  Name: string
  CR: string
  XP: string
  Alignment: string
  Size: string
  Type: string
  SubType: string
  Init: string
  Senses?: string[]
  Aura: string
  AC: string
  AC_Mods: string
  HP: string
  HD: string
  Saves: string
  Fort: string
  Ref: string
  Will: string
  Speed: string
  Melee?: string[]
  Ranged?: string[]
  Space: string
  Reach: string
  SpellLikeAbilities?: SpellLikeAbilities
  SpellsKnown?: SpellLikeAbilities
  AbilityScores: (number | null)[]
  BaseAtk: string
  CMB: string
  CMD: string
  Feats?: string[]
  Skills?: string[]
  Languages?: string[]
  Environment: string
  Organization: string
  Treasure: string
  Description_Visual: string
  Source: string
  IsTemplate: string
  SpecialAbilities?: SpecialAbility[]
  Description?: string[]
  CharacterFlag: string
  CompanionFlag: string
  Fly: string
  Climb: string
  Burrow: string
  Swim: string
  Land: string
  AgeCategory: string
  DontUseRacialHD: string
  CompanionFamiliarLink: string
  LinkText: string
  id: string
  UniqueMonster: string
  MR: string
  Mythic: string
  MT: string
  Group?: string
}

export interface MonsterRaw extends Omit<Monster, 'AbilityScores'
  | 'SpecialAbilities'
  | 'SpellLikeAbilities'
  | 'SpellsKnown'
  | 'Melee'
  | 'Ranged'
  | 'Feats'
  | 'Skills'
  | 'Languages'
  | 'Description'
  | 'Senses'> {
  Melee?: string
  Ranged?: string
  Feats?: string
  Skills?: string
  Languages?: string
  Description?: string
  Senses?: string
  AbilityScores: string
  SpellLikeAbilities: string
  SpecialAbilities: string
  SpellsKnown: string
  FullText?: string
  Group?: string
}

export interface SpecialAbility {
  name: string
  description: string
}

export interface SpellLikeAbilities {
  header: string
  values: SpellLikeAbility[]
}

export interface SpellLikeAbility {
  label: string
  value: string
}
