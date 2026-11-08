import * as migration_20261103_localize_reach_fields from './20261103_localize_reach_fields'
import * as migration_20261108_localize_darshan_label from './20261108_localize_darshan_label'

export const migrations = [
  {
    up: migration_20261103_localize_reach_fields.up,
    down: migration_20261103_localize_reach_fields.down,
    name: '20261103_localize_reach_fields',
  },
  {
    up: migration_20261108_localize_darshan_label.up,
    down: migration_20261108_localize_darshan_label.down,
    name: '20261108_localize_darshan_label',
  },
]
