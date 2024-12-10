//builder
import type Alter from '../builder/Alter';
import type Create from '../builder/Create';
import type Delete from '../builder/Delete';
import type Insert from '../builder/Insert';
import type Select from '../builder/Select';
import type Update from '../builder/Update';
//common
import type { Join, Value, FlatValue, Dialect } from '../types';
import Exception from '../Exception';
import { joins } from '../helpers';

//The character used to quote identifiers.
const q = '`';

const Mysql: Dialect = {
  /**
   * Converts alter builder to query and values
   */
  alter(builder: Alter) {
    const build = builder.build();
    const query: string[] = [];

    const removeFields = build.fields.remove.map(
      name => `DROP ${q}${name}${q}`
    );

    const addFields = Object.keys(build.fields.add).map(name => {
      const field = build.fields.add[name];
      const column: string[] = [];
      column.push(`${q}${name}${q}`);
      field.type && column.push(field.type);
      field.length && column.push(`(${field.length})`);
      field.attribute && column.push(field.attribute);
      field.unsigned && column.push('UNSIGNED');
      field.nullable && column.push('NOT NULL');
      field.autoIncrement && column.push('AUTO_INCREMENT');
      if (field.default) {
        if (!isNaN(Number(field.default))) {
          column.push(`DEFAULT ${field.default}`);
        } else {
          column.push(`DEFAULT '${field.default}'`);
        }
      } else if (field.nullable) {
        column.push('DEFAULT NULL');
      }

      return `ADD COLUMN ${column.join(' ')}`;
    });

    const changeFields = Object.keys(build.fields.update).map(name => {
      const field = build.fields.add[name];
      const column: string[] = [];
      column.push(`${q}${name}${q}`);
      field.type && column.push(field.type);
      field.length && column.push(`(${field.length})`);
      field.attribute && column.push(field.attribute);
      field.unsigned && column.push('UNSIGNED');
      field.nullable && column.push('NOT NULL');
      field.autoIncrement && column.push('AUTO_INCREMENT');
      if (field.default) {
        if (!isNaN(Number(field.default))) {
          column.push(`DEFAULT ${field.default}`);
        } else {
          column.push(`DEFAULT '${field.default}'`);
        }
      } else if (field.nullable) {
        column.push('DEFAULT NULL');
      }

      return `CHANGE COLUMN ${column.join(' ')}`;
    });

    const removePrimaries = build.primary.remove.map(
      name => `DROP PRIMARY KEY ${q}${name}${q}`
    );

    const addPrimaries = `ADD PRIMARY KEY (${q}${build.primary.remove.join(`${q}, ${q}`)}${q})`;

    const removeUniques = build.unique.remove.map(
      name => `DROP UNIQUE ${q}${name}${q}`
    );

    const addUniques = Object.keys(build.unique.add).map(
      key => `ADD UNIQUE ${q}${key}${q} (${q}${build.unique.add[key].join(`${q}, ${q}`)}${q})`
    );

    const removeKeys = build.keys.remove.map(
      name => `DROP INDEX ${q}${name}${q}`
    );

    const addKeys = Object.keys(build.keys.add).map(
      key => `ADD INDEX ${q}${key}${q} (${q}${build.unique.add[key].join(`${q}, ${q}`)}${q})`
    );

    if (!removeFields.length
      && !addFields.length
      && !changeFields.length
      && !removePrimaries.length
      && !addPrimaries.length
      && !removeUniques.length
      && !addUniques.length
      && !removeKeys.length
      && !addKeys.length
    ) {
      throw Exception.for('No alterations made.')
    }

    query.push(
      ...removeFields,
      ...addFields,
      ...changeFields,
      ...removePrimaries,
      ...addPrimaries,
      ...removeUniques,
      ...addUniques,
      ...removeKeys,
      ...addKeys
    );
    return { 
      query: `ALTER TABLE ${build.table} (${query.join(', ')})`, 
      values: [] 
    };
  },

  /**
   * Converts create builder to query and values
   */
  create(builder: Create) {
    const build = builder.build();
    if (!Object.values(build.fields).length) {
      throw Exception.for('No fields provided');
    }

    const query: string[] = [];

    const fields = Object.keys(build.fields).map(name => {
      const field = build.fields[name];
      const column: string[] = [];
      column.push(`${q}${name}${q}`);
      if (field.type && field.length) {
        column.push(`${field.type}(${field.length})`);
      } else {
        field.type && column.push(field.type);
        field.length && column.push(`(${field.length})`);
      }
      field.attribute && column.push(field.attribute);
      field.unsigned && column.push('UNSIGNED');
      field.nullable && column.push('NOT NULL');
      field.autoIncrement && column.push('AUTO_INCREMENT');
      if (field.default) {
        if (!isNaN(Number(field.default))) {
          column.push(`DEFAULT ${field.default}`);
        } else {
          column.push(`DEFAULT '${field.default}'`);
        }
      } else if (field.nullable) {
        column.push('DEFAULT NULL');
      }

      return column.join(' ');
    }).join(', ');

    query.push(fields);
  
    if (build.primary.length) {
      query.push(`, PRIMARY KEY (${build.primary
        .map(key => `${q}${key}${q}`)
        .join(', ')})`
      );
    }

    if (build.unique.length) {
      query.push(Object.keys(build.unique).map(
        key => `, UNIQUE KEY ${q}${key}${q} (${q}${build.unique[key].join(`${q}, ${q}`)}${q})`
      ).join(', '));
    }

    if (build.keys.length) {
      query.push(Object.keys(build.keys).map(
        key => `, KEY ${q}${key}${q} (${q}${build.keys[key].join(`${q}, ${q}`)}${q})`
      ).join(', '));
    }

    return { 
      query: `CREATE TABLE IF NOT EXISTS ${build.table} (${query.join(' ')})`, 
      values: [] 
    };
  },

  /**
   * Converts delete builder to query and values
   */
  delete(builder: Delete) {
    const build = builder.build();
    if (!build.filters.length) {
      throw Exception.for('No filters provided');
    }

    const query: string[] = [];
    const values: FlatValue[] = [];
    query.push(`DELETE FROM ${q}${build.table}${q}`);

    const filters = build.filters.map(filter => {
      values.push(...filter[1]);
      return filter[0];
    }).join(' AND ');
    query.push(`WHERE ${filters}`);

    return { query: query.join(' '), values };
  },

  /**
   * Converts insert builder to query and values
   */
  insert(builder: Insert) {
    const build = builder.build();
    if (build.values.length === 0) {
      throw Exception.for('No values provided');
    }

    const query: string[] = [];
    const values: Value[] = [];
    
    query.push(`INSERT INTO ${q}${build.table}${q}`);

    const keys = Object.keys(build.values[0]);
    query.push(`(${q}${keys.join(`${q}, ${q}`)}${q})`);

    const row = build.values.map((value) => {
      const row = keys.map(key => value[key]);
      values.push(...row);
      return `(${row.map(() => '?').join(', ')})`;
    });

    query.push(`VALUES ${row.join(', ')}`);
    return { query: query.join(' '), values };
  },

  /**
   * Converts select builder to query and values
   */
  select(builder: Select) {
    const build = builder.build();
    if (!build.table) {
      throw Exception.for('No table specified');
    }

    const query: string[] = [];
    const values: FlatValue[] = [];

    const columns = build.columns
      .map(column => column.split(' '))
      .flat(1)
      .map(column => `${q}${
        column.split('.').join(`${q}.${q}`)
      }${q}`.replaceAll(`${q}*${q}`, '*'));

    query.push(`SELECT ${columns.join(', ')}`);
    if (build.table) {
      if (build.table[1] !== build.table[0]) {
        query.push(`FROM ${q}${build.table[0]}${q} AS ${q}${build.table[1]}${q}`);
      } else {
        query.push(`FROM ${q}${build.table[0]}${q}`);
      }
    }

    if (build.relations.length) {
      const relations = build.relations.map(relation => {
        const type = relation.type as Join;
        const table = relation.table !== relation.as 
          ? `${q}${relation.table}${q} AS ${q}${relation.as}${q}`
          : `${q}relation.table${q}`;
        return `${joins[type]} ${table} ON (${q}${relation.from}${q} = ${q}${relation.to}${q})`;
      });
      query.push(relations.join(' '));
    }

    if (build.filters.length) {
      const filters = build.filters.map(filter => {
        values.push(...filter[1]);
        return filter[0];
      }).join(' AND ');
      query.push(`WHERE ${filters}`);
    }

    if (build.sort.length) {
      const sort = build.sort.map((sort) => `${sort[0]} ${sort[1]}`);
      query.push(`ORDER BY ${q}${sort.join(`${q}, ${q}`)}${q}`);
    }

    if (build.limit) {
      query.push(`LIMIT ${build.limit}`);
    }

    if (build.offset) {
      query.push(`OFFSET ${build.offset}`);
    }

    return { query: query.join(' '), values };
  },

  /**
   * Converts update builder to query and values
   */
  update(builder: Update) {
    const build = builder.build();
    if (!Object.keys(build.data).length) {
      throw Exception.for('No data provided');
    }

    const query: string[] = [];
    const values: Value[] = [];

    query.push(`UPDATE ${q}${build.table}${q}`);

    if (Object.keys(build.data).length) {
      const data = Object.keys(build.data).map(key => {
        values.push(build.data[key]);
        return `${key} = ?`;
      }).join(', ');
      query.push(`SET ${data}`);
    }

    if (build.filters.length) {
      const filters = build.filters.map(filter => {
        values.push(...filter[1]);
        return filter[0];
      }).join(' AND ');
      query.push(`WHERE ${filters}`);
    }

    return { query: query.join(' '), values };
  },
};

export default Mysql;