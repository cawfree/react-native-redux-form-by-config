import { Map, List } from 'immutable';

const shouldRepresentUsingArray = (m = Map({})) => {
  const keys = m
    .keySeq();
  const isAllIntegers = keys
    .reduce(
      (result, key) => (
        result && !Number.isNaN(key)
      ),
      true,
    );
  // XXX: Enforce that they must be a sequential set starting from zero.
  if (isAllIntegers) {
    return keys
      .map(key => Number.parseInt(key))
      .sort((e1, e2) => e1 - e2)
      .reduce(
        (result, key, i) => result && (key === i),
        true,
      );
  }
  return false;
};

// all must be integers in group, otherwise obj

// XXX: It's useful to turn things that look like arrays into a natural array.
const transform = (result = Map({})) => {
  const shouldUseArray = shouldRepresentUsingArray(
    result,
  );
  if (shouldUseArray) {
    return result
      .entrySeq()
      .map(
        ([key, value]) => (
          [Number.parseInt(key), value]
        )
      )
      .sort(
        ({ key: e1 }, { key: e2 }) => (
          e1 - e2
        ),
      )
      .reduce(
        (l, [u, value]) => (
          l.push(
            Map.isMap(value) ? transform(value) : value,
          )
        ),
        List([]),
      );
  }
  const keys = result
    .keySeq();
  return result
    .entrySeq()
    .reduce(
      (m, [key, value]) => (
        m.set(
          key,
          Map.isMap(value) ? transform(value) : value,
        )
      ),
      Map({}),
    );
};

export default transform;

