import { generateState, generateNode } from "./fixture";
import { down } from "../index";

describe("down", () => {
  describe("root level", () => {
    test("go to sibling", () => {
      const state = generateState({ currentPath: [0] });
      const result = down(state);

      expect(result.currentPath).toEqual([1]);
    });

    test("go to child", () => {
      const state = generateState({ currentPath: [1, 1] });
      const result = down(state);

      expect(result.currentPath).toEqual([1, 1, 0]);
    });

    test("go parents sibling", () => {
      const state = generateState({ currentPath: [1, 1, 0] });
      const result = down(state);

      expect(result.currentPath).toEqual([1, 2]);
    });

    test("skip folded", () => {
      const state = generateState({ currentPath: [3] });
      const result = down(state);

      expect(result.currentPath).toEqual([4]);
    });

    test("stop at last", () => {
      const state = generateState({ currentPath: [4] });
      const result = down(state);

      expect(result.currentPath).toEqual([4]);
    });
  });

  describe("nested", () => {
    test("stop at last", () => {
      const state = generateState({ currentPath: [4, 0] });
      const child = generateNode("4,0");
      state.nodes[4].nodes.push(child);
      const result = down(state);

      expect(result.currentPath).toEqual([4, 0]);
    });
  });
});
