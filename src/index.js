import { v4 as uuidv4 } from 'uuid';
import Immutable from 'immutable';

const weeDb = async function (load, save) {
  let db = new Immutable.Map();
  const cb = save;

  if (load) {
    const data = await load();
    db = Immutable.Map(Immutable.fromJS(data));
  }

  const isString = (key) =>
    Object.prototype.toString.call(key) === '[object String]';

  const validate = (value) =>
    value !== undefined && value !== null && value.constructor === Object;

  const insert = async (key, value) => {
    if (!isString(key)) {
      throw new Error('Invalid key');
    }

    if (!validate(value)) {
      throw new Error('Invalid value');
    }

    let currentList = Immutable.List([]);

    if (db.has(key)) {
      currentList = db.get(key);
    }

    const record = Immutable.Map(
      Immutable.fromJS({
        ...value,
        id: uuidv4(),
      })
    );

    const newList = currentList.push(record);
    db = db.set(key, newList);

    if (cb) {
      await cb(db.toJS());
    }

    return record.get('id');
  };

  const update = async (key, value) => {
    if (!isString(key)) {
      throw new Error('Invalid key');
    }

    if (!validate(value)) {
      throw new Error('Invalid value');
    }

    if (!db.has(key)) {
      throw new Error('Invalid key');
    }

    if (!value.id) {
      throw new Error('Invalid id');
    }

    const currentList = db.get(key);

    const index = currentList.findIndex((e) => e.get('id') === value.id);
    const record = currentList.get(index);

    const newRecord = record.mergeDeep(value);

    const newList = currentList.set(index, newRecord);
    db = db.set(key, newList);

    if (cb) {
      await cb(db.toJS());
    }
  };

  const get = (key, id) => {
    if (!isString(key)) {
      throw new Error('Invalid key');
    }

    if (!db.has(key)) {
      throw new Error('Invalid key');
    }

    const currentList = db.get(key);
    const record = currentList.find((e) => e.get('id') === id);

    return record.toJS() ?? null;
  };

  const query = (key, predicate) => {
    if (!isString(key)) {
      throw new Error('Invalid key');
    }

    if (!db.has(key)) {
      throw new Error('Invalid key');
    }

    const currentList = db.get(key);
    const records = currentList.filter(predicate);

    return records.toJS();
  };

  return { insert, update, get, query };
};

weeDb.getId = () => uuidv4();

export { weeDb };
