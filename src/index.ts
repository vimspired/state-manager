import { decrement } from "./helpers";

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

type StateManipulationFn = (state: OutlinerState) => OutlinerState;

export const up: StateManipulationFn = (state) => decrement(state);

export const down: StateManipulationFn = (state) => state;
export const append: StateManipulationFn = (state) => state;
export const prepend: StateManipulationFn = (state) => state;
export const remove: StateManipulationFn = (state) => state;
