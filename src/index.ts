import { decrement, increment } from "./helpers";
export {
  toggleFolding,
  append,
  normalMode,
  insertMode,
  setText,
} from "./helpers";

export type OutlinerNode = {
  id: string;
  text: string;
  folded: boolean;
  nodes: OutlinerNode[];
};

export type OutlinerPath = number[];

export enum Mode {
  Normal = "normal",
  Insert = "insert",
}

export type OutlinerState = {
  currentPath: OutlinerPath;
  mode: Mode;
  nodes: OutlinerNode[];
};

export type NodeTuple = [OutlinerNode, OutlinerPath];

export type StateManipulationFn = (state: OutlinerState) => OutlinerState;

export const up: StateManipulationFn = (state) => decrement(state);
export const down: StateManipulationFn = (state) => increment(state);

export const prepend: StateManipulationFn = (state) => state;
export const remove: StateManipulationFn = (state) => state;
