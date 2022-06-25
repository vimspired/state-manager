import { generateNode, generateState } from "./fixture";
import { remove } from "../index";
import { pluck } from "ramda";

describe("remove", () => {
  describe("navigate after removing", () => {
    test("navigate up if removed node is last root node", () => {
      const state = generateState({ currentPath: [4] });
      const result = remove(state);

      expect(result.currentPath).toEqual([3]);
    });

    test("navigate up if removed node is last", () => {
      const state = generateState({ currentPath: [1, 2, 1] });
      const result = remove(state);

      expect(result.currentPath).toEqual([1, 2, 0]);
    });

    test("navigate to siblings last child if removed node is last child", () => {
      const state = generateState({ currentPath: [1, 2] });
      const result = remove(state);

      expect(result.currentPath).toEqual([1, 1, 0]);
    });

    test("navigate to parent when only child is removed", () => {
      const state = generateState({ currentPath: [1, 1, 0] });
      const result = remove(state);

      expect(result.currentPath).toEqual([1, 1]);
    });
  });

  test("remove current root node", () => {
    const state = generateState({ currentPath: [1] });
    const nodeCount = state.nodes.length;
    const result = remove(state);

    expect(result.nodes.length).toEqual(nodeCount - 1);
    expect(pluck("id", result.nodes)).not.toContain("1");
  });

  test("doesn't remove last root node", () => {
    const state = generateState({
      nodes: [generateNode("0")],
      currentPath: [0],
    });
    const result = remove(state);
    expect(result.nodes.length).toBe(1);
  });

  test("remove current nested node/a", () => {
    const state = generateState({ currentPath: [1, 1] });
    const nodeCount = state.nodes[1].nodes.length;
    const result = remove(state);

    expect(result.nodes[1].nodes.length).toEqual(nodeCount - 1);
    expect(pluck("id", result.nodes[1].nodes)).not.toContain("1,1");
  });

  test("remove current nested node/b", () => {
    const state = generateState({ currentPath: [1, 2, 1] });
    const nodeCount = state.nodes[1].nodes[2].nodes.length;
    const result = remove(state);

    expect(result.nodes[1].nodes[2].nodes.length).toEqual(nodeCount - 1);
    expect(pluck("id", result.nodes[1].nodes[2].nodes)).not.toContain("1,2,1");
  });
});
