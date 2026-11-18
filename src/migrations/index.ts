import * as migration_20261113_140852_workclub_tables from './20261113_140852_workclub_tables';
import * as migration_20261118_114212_plan_details from './20261118_114212_plan_details';

export const migrations = [
  {
    up: migration_20261113_140852_workclub_tables.up,
    down: migration_20261113_140852_workclub_tables.down,
    name: '20261113_140852_workclub_tables',
  },
  {
    up: migration_20261118_114212_plan_details.up,
    down: migration_20261118_114212_plan_details.down,
    name: '20261118_114212_plan_details'
  },
];
