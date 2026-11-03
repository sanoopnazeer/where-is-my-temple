import * as migration_20261103_localize_reach_fields from './20261103_localize_reach_fields'

export const migrations = [
  {
    up: migration_20261103_localize_reach_fields.up,
    down: migration_20261103_localize_reach_fields.down,
    name: '20261103_localize_reach_fields',
  },
]
