import { generateState } from "./fixture";
import { up } from "../index";

describe("up", () => {
  describe("root level", () => {
    test("stay at top line", () => {
      const state = generateState({ currentPath: [0] });
      const result = up(state);

      expect(result.currentPath).toEqual([0]);
    });

    test("go to previous sibling", () => {
      const state = generateState({ currentPath: [1] });
      const result = up(state);

      expect(result.currentPath).toEqual([0]);
    });

    test("go to last child of previous sibling", () => {
      const state = generateState({ currentPath: [2] });
      const result = up(state);

      expect(result.currentPath).toEqual([1, 2, 1]);
    });

    test("skip folded", () => {
      const state = generateState({ currentPath: [4] });
      const result = up(state);

      expect(result.currentPath).toEqual([3]);
    });
  });

  describe("nested", () => {
    test("go to sibling", () => {
      const state = generateState({ currentPath: [1, 2, 1] });
      const result = up(state);

      expect(result.currentPath).toEqual([1, 2, 0]);
    });

    test("go to parent", () => {
      const state = generateState({ currentPath: [1, 2, 0] });
      const result = up(state);

      expect(result.currentPath).toEqual([1, 2]);
    });

    test("go to last child of sibling", () => {
      const state = generateState({ currentPath: [1, 2] });
      const result = up(state);

      expect(result.currentPath).toEqual([1, 1, 0]);
    });

    test("skip folded", () => {
      const state = generateState({ currentPath: [3, 1] });
      const result = up(state);

      expect(result.currentPath).toEqual([3]);
    });
  });

  describe("deleted node", () => {
    test("to root level sibling", () => {
      const state = generateState({ currentPath: [5] });
      const result = up(state);

      expect(result.currentPath).toEqual([4]);
    });

    test.only("to nested sibling", () => {
      const state = generateState({ currentPath: [1, 2, 2] });
      const result = up(state);

      expect(result.currentPath).toEqual([1, 2, 1]);
    });

    test("go to last child of sibling", () => {
      const state = generateState({ currentPath: [1, 3] });
      const result = up(state);

      expect(result.currentPath).toEqual([1, 2, 1]);
    });

    test("go to parent", () => {
      const state = generateState({ currentPath: [2, 0] });
      const result = up(state);

      expect(result.currentPath).toEqual([2]);
    });
  });
});
