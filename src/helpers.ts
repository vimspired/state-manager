import { dropLast, last } from "ramda";
import { OutlinerState, OutlinerPath, OutlinerNode, NodeTuple } from "./index";

export const decrement = (state: OutlinerState): OutlinerState => {
  if (state.currentPath.length > 1) {
    const index = last(state.currentPath);
    if (index === 0) {
      return setCurrentPath(state, dropLast(1, state.currentPath));
    }
  }
  const [, siblingPath] = getPreviousSibling(state);
  const [, childPath] = getDeepestChildOf(state, siblingPath);

  return setCurrentPath(state, childPath);
};

// Private functions

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
