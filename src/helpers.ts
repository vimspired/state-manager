import {
  dropLast,
  insert,
  last,
  lensPath,
  pipe,
  remove as rRemove,
  set,
} from "ramda";
import {
  OutlinerState,
  OutlinerPath,
  OutlinerNode,
  NodeTuple,
  StateManipulationFn,
  Mode,
} from "./index";

const generateNode = (): OutlinerNode => ({
  id: `${+new Date()}`,
  text: "",
  folded: false,
  nodes: [],
});

export const indent: StateManipulationFn = (state) => {
  return state;
};

export const decrement: StateManipulationFn = (state) => {
  if (state.currentPath.length > 1) {
    const index = last(state.currentPath);
    if (index === 0) {
      return setCurrentPath(state, dropLast(1, state.currentPath));
    }
  } else {
    if (state.currentPath[0] === 0) return state;
  }
  const [sibling, siblingPath] = getPreviousSibling(state);
  if (sibling) {
    const [, childPath] = getDeepestChildOf(state, siblingPath);
    return setCurrentPath(state, childPath);
  }

  return state;
};

export const insertMode: StateManipulationFn = (state) =>
  setMode(Mode.Insert)(state);

export const normalMode: StateManipulationFn = (state) => {
  const [current] = getCurrent(state);
  if (current.text.length > 0 || current.nodes.length > 0)
    return setMode(Mode.Normal)(state);

  return pipe(setMode(Mode.Normal), deleteNode, decrement)(state);
};

export const deleteNode: StateManipulationFn = (state) => {
  if (state.currentPath.length === 1) {
    const nodes = rRemove(state.currentPath[0], 1, state.nodes);
    return {
      ...state,
      nodes,
    };
  }

  const [parent, parentPath] = getParent(state);
  const index = last(state.currentPath);
  const children = rRemove(index, 1, parent.nodes);

  return setPropIn(parentPath, "nodes", children)(state);
};

export const insertNodeAt = (node: OutlinerNode, path: OutlinerPath) => {
  return (state: OutlinerState): OutlinerState => {
    if (path.length === 1) {
      const children = insert(path[0], node, state.nodes);
      return setPropIn([], "nodes", children)(state);
    }

    const parentPath = dropLast(1, path);
    const [parent] = getByPath(state, parentPath);
    const index = last(path);
    const children = insert(index, node, parent.nodes);
    return setPropIn(parentPath, "nodes", children)(state);
  };
};

export const prepend: StateManipulationFn = (state) => {
  const newNode = generateNode();

  return pipe(
    insertNodeAt(newNode, state.currentPath),
    setMode(Mode.Insert)
  )(state);
};

export const append: StateManipulationFn = (state) => {
  const [current, path] = getCurrent(state);
  if (current.nodes.length && !current.folded) {
    // Add to top of children
    const children = insert(0, generateNode(), current.nodes);
    const newPath = [...path, 0];
    return pipe(
      setPropIn(path, "nodes", children),
      setMode(Mode.Insert),
      setPath(newPath)
    )(state);
  } else {
    // Add sibling
    const index = last(path);
    const [parent, parentPath] = getParent(state);
    const children = insert(index + 1, generateNode(), parent.nodes);

    return pipe(
      setPropIn(parentPath, "nodes", children),
      setMode(Mode.Insert),
      setPath(incrementLastIndex(path))
    )(state);
  }
};

export const setText = (text: string) => {
  return (state: OutlinerState): OutlinerState => {
    const [, path] = getCurrent(state);
    return setPropIn(path, "text", text)(state);
  };
};

const removeNodeAtPath = (
  state: OutlinerState,
  path: OutlinerPath
): OutlinerState => {
  const fns = [];

  if (path.length === 1) {
    const nodes = rRemove(path[0], 1, state.nodes);
    if (!nodes.length) return state;

    fns.push(setPropIn([], "nodes", nodes));
  } else {
    const parentPath = dropLast(1, path);
    const [parent] = getByPath(state, parentPath);
    const index = last(path);
    const nodes = rRemove(index, 1, parent.nodes);

    fns.push(setPropIn(parentPath, "nodes", nodes));
  }

  fns.push(decrement);

  // @ts-ignore
  return pipe(...fns)(state);
};

export const remove: StateManipulationFn = (state) => {
  const [, path] = getCurrent(state);
  return removeNodeAtPath(state, path);
};

export const toggleFolding: StateManipulationFn = (state) => {
  const [current, path] = getCurrent(state);
  const isFolded = current.folded;
  return setPropIn(path, "folded", !isFolded)(state);
};

export const increment: StateManipulationFn = (state) => {
  const [current, currentPath] = getCurrent(state);
  if (current.nodes.length && !current.folded)
    return setCurrentPath(state, [...currentPath, 0]);

  const [sibling, siblingPath] = getNextSibling(state);
  if (sibling) return setCurrentPath(state, siblingPath);

  const [, ancestorsSiblingPath] = recursivelyFindNextSiblingOfParent(state);
  if (ancestorsSiblingPath) return setCurrentPath(state, ancestorsSiblingPath);

  return state;
};

// Private functions

const getCurrent = (state: OutlinerState): NodeTuple =>
  getByPath(state, state.currentPath);

const getParent = (state: OutlinerState): NodeTuple => {
  const [, currentPath] = getCurrent(state);
  const path = dropLast(1, currentPath);
  return getByPath(state, path);
};

const setCurrentPath = (
  state: OutlinerState,
  currentPath: OutlinerPath
): OutlinerState => {
  let nextPath = firstUnfoldedAncestor(state, currentPath);
  return {
    ...state,
    currentPath: nextPath,
  };
};

const getByPath = (state: OutlinerState, path: OutlinerPath): NodeTuple => {
  const { nodes } = state;
  const item = path.reduce(
    (acc: OutlinerNode, index: number) => {
      return acc.nodes[index];
    },
    { nodes } as OutlinerNode
  );

  return [item, path];
};

const incrementLastIndex = (path: OutlinerPath): OutlinerPath => {
  const lastIndex = last(path);
  const parentPath = dropLast(1, path);
  return [...parentPath, lastIndex + 1];
};

const getDeepestChildOf = (
  state: OutlinerState,
  path: OutlinerPath
): NodeTuple => {
  let [node, deepPath] = getByPath(state, path);
  while (node.nodes.length) {
    deepPath.push(node.nodes.length - 1);
    node = last(node.nodes);
  }

  return [node, deepPath];
};

const getPreviousSibling = (
  state: OutlinerState
): [OutlinerNode, OutlinerPath] => {
  const index = last(state.currentPath);
  const decremented = Math.max(0, index - 1);
  const parentPath = dropLast(1, state.currentPath);
  const previousSiblingPath = [...parentPath, decremented];
  return getByPath(state, previousSiblingPath);
};

const getNextSibling = (state: OutlinerState): [OutlinerNode, OutlinerPath] => {
  const incremented = last(state.currentPath) + 1;
  const parentPath = dropLast(1, state.currentPath);
  const nextSiblingPath = [...parentPath, incremented];
  return getByPath(state, nextSiblingPath);
};

const firstUnfoldedAncestor = (
  state: OutlinerState,
  path: OutlinerPath
): OutlinerPath => {
  let iterator = [...path];

  while (hasFoldedAncestor(state, iterator) && path.length > 0) {
    iterator.pop();
  }

  return iterator;
};

const hasFoldedAncestor = (
  state: OutlinerState,
  path: OutlinerPath
): boolean => {
  let hasFolded = false;
  let iterator = dropLast(1, path);
  while (iterator.length) {
    const [item] = getByPath(state, iterator);
    if (item.folded) {
      hasFolded = true;
      break;
    }
    iterator.pop();
  }
  return hasFolded;
};

const getSiblingOf = (state: OutlinerState, path: OutlinerPath): NodeTuple => {
  const newPath = incrementLastIndex(path);
  return getByPath(state, newPath);
};

export const recursivelyFindNextSiblingOfParent = (
  state: OutlinerState
): [OutlinerNode | null, OutlinerPath | null] => {
  const [, path] = getCurrent(state);
  let iterator = [...path];

  while (iterator.length) {
    const [sibling, siblingPath] = getSiblingOf(state, iterator);
    if (sibling) return [sibling, siblingPath];
    iterator.pop();
  }

  return [null, null];
};

// Pipeable functions
const setPropIn = (path: OutlinerPath, prop: string, value: any): any => {
  return (state: OutlinerState) => {
    const actualPath = path.reduce(
      (acc: any[], val: any) => [...acc, "nodes", val],
      []
    );
    const lens = lensPath([...actualPath, prop]);
    return set(lens, value, state);
  };
};

const setMode = (mode: Mode) => {
  return (state: OutlinerState) => ({
    ...state,
    mode,
  });
};

const setPath = (path: OutlinerPath): StateManipulationFn => {
  return (state: OutlinerState) => {
    const currentPath = firstUnfoldedAncestor(state, path);
    return {
      ...state,
      currentPath,
    };
  };
};
