import * as migration_20261113_140852_workclub_tables from './20261113_140852_workclub_tables';

export const migrations = [
  {
    up: migration_20261113_140852_workclub_tables.up,
    down: migration_20261113_140852_workclub_tables.down,
    name: '20261113_140852_workclub_tables'
  },
];
