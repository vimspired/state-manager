import { generateState } from "./fixture";
import { indent } from "../index";

describe.skip("indent", () => {
  describe("indentable", () => {
    test("move into previous sibling", () => {
      const state = generateState({ currentPath: [0] });
      const result = indent(state);

      expect(result.currentPath).toEqual("xxx?");
    });
  });

  describe("non-indentable", () => {
    test("does nothing with first child", () => {
      const state = generateState({ currentPath: [0] });
      const result = indent(state);

      expect(result.currentPath).toEqual("xxx?");
    });
  });
});
