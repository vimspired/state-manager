import { generateState } from "./fixture";
import { indent } from "../index";

describe("indent", () => {
  describe("...?", () => {
    test("..?", () => {
      const state = generateState({ currentPath: [0] });
      const result = indent(state);

      expect(result.currentPath).toEqual("xxx?");
    });
  });
});
