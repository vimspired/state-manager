import { generateState } from "./fixture";
import { toggleFolding } from "../index";

describe("toggleFolding", () => {
  describe("root level", () => {
    test("fold", () => {
      const state = generateState({ currentPath: [1] });
      state.nodes[1].folded = false;
      const result = toggleFolding(state);

      expect(result.nodes[1].folded).toBeTruthy();
    });

    test("unfold", () => {
      const state = generateState({ currentPath: [1] });
      state.nodes[1].folded = true;
      const result = toggleFolding(state);

      expect(result.nodes[1].folded).toBeFalsy();
    });
  });

  describe("nested", () => {
    test("fold", () => {
      const state = generateState({ currentPath: [1, 1, 0] });
      state.nodes[1].nodes[1].nodes[0].folded = false;
      const result = toggleFolding(state);

      expect(result.nodes[1].nodes[1].nodes[0].folded).toBeTruthy();
    });

    test("unfold", () => {
      const state = generateState({ currentPath: [1, 1, 0] });
      state.nodes[1].nodes[1].nodes[0].folded = true;
      const result = toggleFolding(state);

      expect(result.nodes[1].nodes[1].nodes[0].folded).toBeFalsy();
    });
  });
});
