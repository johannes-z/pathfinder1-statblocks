# Pathfinder 1e Statblocks

Extracts statblocks from the Pathfinder 1e SRD and formats them as yaml.

The Statblocks come from these two DBs/Spreadsheets:

* [Monster Bestiary Full (Updated 27Jul2015)](https://docs.google.com/spreadsheets/d/1Vn18JFxojAGXD4irfJM0hYiL9-198vO-Pj_5bbuUtbw/edit#gid=1526751511) as hosted on [Pathfinder Community](https://www.pathfindercommunity.net/home/databases/monsters)
* [NPC DB](https://www.d20pfsrd.com/bestiary/npc-s/npc-db)

There are some post processing steps to sanitize and format the data to be more
usable in other projects.

## Requirements

This project uses [Bun](https://bun.sh/).

## Usage

* Install dependencies: `bun install`
* Build the project: `bun run ./src/index.ts`

## Planned Features

* Web UI for:
  * searching and viewing statblocks
  * extending statblocks (customizing statblocks)
  * create links for keywords to the [Pathfinder 1e SRD](https://www.d20pfsrd.com/)

## Legal Notice

This project uses trademarks and/or copyrights owned by Paizo Inc., used under
[Paizo's Community Use Policy](https://paizo.com/community/communityuse). This
project is not published, endorsed, or specifically approved by Paizo. For more
information about Paizo Inc. and Paizo products, visit paizo.com.

### License

Any other source code is licensed under the MIT License.
