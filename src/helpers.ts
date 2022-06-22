import { dropLast, last } from "ramda";
import {
  OutlinerState,
  OutlinerPath,
  OutlinerNode,
  NodeTuple,
  StateManipulationFn,
} from "./index";

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

export const increment: StateManipulationFn = (state) => {
  const [current, currentPath] = getCurrent(state);
  if (current.nodes.length && !current.folded)
    return setCurrentPath(state, [...currentPath, 0]);

  const [sibling, siblingPath] = getNextSibling(state);
  if (sibling) return setCurrentPath(state, siblingPath);

  const [ancestorsSibling, ancestorsSiblingPath] =
    recursivelyFindNextSiblingOfParent(state);
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
