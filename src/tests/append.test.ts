import { generateState } from "./fixture";
import { append, Mode } from "../index";

describe("append", () => {
  test("go to insert mode", () => {
    const state = generateState({ mode: Mode.Normal });
    const result = append(state);

    expect(result.mode).toEqual(Mode.Insert);
  });

  describe("root level", () => {
    test("set currentPath for sibling", () => {
      const state = generateState({ currentPath: [0] });
      const result = append(state);

      expect(result.currentPath).toEqual([1]);
    });

    test("set currentPath for child", () => {
      const state = generateState({ currentPath: [1] });
      const result = append(state);

      expect(result.currentPath).toEqual([1, 0]);
    });

    test("add sibling", () => {
      const state = generateState({ currentPath: [0] });
      const rootNodesCount = state.nodes.length;
      const result = append(state);

      expect(result.nodes.length).toEqual(rootNodesCount + 1);
      expect(result.nodes[2].id).toEqual("1");
    });

    test("add child", () => {
      const state = generateState({ currentPath: [1] });
      const nodesCount = state.nodes[1].nodes.length;
      const result = append(state);

      expect(result.nodes[1].nodes.length).toEqual(nodesCount + 1);
      expect(result.nodes[1].nodes[1].id).toEqual("1,0");
    });
    // Skip folded
  });

  describe("nested", () => {
    test("add sibling", () => {
      const state = generateState({ currentPath: [1, 1, 0] });
      const nodesCount = state.nodes[1].nodes[1].nodes.length;
      const result = append(state);

      expect(result.nodes[1].nodes[1].nodes.length).toEqual(nodesCount + 1);
      expect(result.nodes[1].nodes[1].nodes[1].id.length).toBeGreaterThan(10);
    });

    test("add child", () => {
      const state = generateState({ currentPath: [1, 1] });
      const nodesCount = state.nodes[1].nodes[1].nodes.length;
      const result = append(state);

      expect(result.nodes[1].nodes[1].nodes.length).toEqual(nodesCount + 1);
      expect(result.nodes[1].nodes[1].nodes[0].id.length).toBeGreaterThan(10);
    });
    // Skip folded
  });
});
