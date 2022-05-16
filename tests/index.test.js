import { weeDb } from '../src/index';

describe('wee db tests', () => {
  test('get id', async () => {
    const id = weeDb.getId();

    expect(id).toBeTruthy();
  });

  test('init', async () => {
    const id = weeDb.getId();
    const load = () => {
      return { subjects: [{ id, name: 'Yani', age: 30 }] };
    };
    const save = (dbToJS) => {
      console.log(dbToJS);
    };

    const db = await weeDb(load, save);
    const subject = db.get('subjects', id);

    expect(subject.name).toBe('Yani');
    expect(subject.age).toBe(30);

    const id2 = await db.insert('subjects', { name: 'Lili', age: 30 });
    const subject2 = db.get('subjects', id2);

    expect(subject2.name).toBe('Lili');
    expect(subject2.age).toBe(30);
  });

  test('insert', async () => {
    const db = await weeDb(null, null);
    const id = await db.insert('subjects', { name: 'Yani', age: 30 });

    const subject = db.get('subjects', id);

    expect(subject.name).toBe('Yani');
    expect(subject.age).toBe(30);
  });

  test('update', async () => {
    const db = await weeDb(null, null);
    const id = await db.insert('subjects', { name: 'Yani', age: 30 });

    await db.update('subjects', { id, name: 'Lili' });

    const subject = db.get('subjects', id);

    expect(subject.name).toBe('Lili');
    expect(subject.age).toBe(30);
  });

  test('query', async () => {
    const db = await weeDb(null, null);
    const id1 = await db.insert('subjects', { name: 'Yani', age: 30 });
    const id2 = await db.insert('subjects', { name: 'Lili', age: 30 });

    const records = db.query('subjects', (e) => e.get('id') === id1);

    expect(records.length).toBe(1);
  });

  test('query empty', async () => {
    const db = await weeDb(null, null);
    const id = await db.insert('subjects', { name: 'Yani', age: 30 });
    const randomId = weeDb.getId();

    const records = db.query('subjects', (e) => e.id === randomId);

    expect(records).toStrictEqual([]);
  });

  test('null', async () => {
    const db = await weeDb(null, null);
    const id = weeDb.getId();

    expect(() => {
      db.get('subjects', id);
    }).toThrow();
  });
});
