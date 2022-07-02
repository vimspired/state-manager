import { generateState } from "./fixture";
import { prepend, Mode } from "../index";

describe("prepend", () => {
  test("go to insert mode", () => {
    const state = generateState({ mode: Mode.Normal });
    const result = prepend(state);

    expect(result.mode).toEqual(Mode.Insert);
  });

  describe("root level", () => {
    test("leave currentPath as is for sibling", () => {
      const state = generateState({ currentPath: [0] });
      const result = prepend(state);

      expect(result.currentPath).toEqual([0]);
    });

    test("add sibling", () => {
      const state = generateState({ currentPath: [0] });
      const rootNodesCount = state.nodes.length;
      const result = prepend(state);

      expect(result.nodes.length).toEqual(rootNodesCount + 1);
      expect(result.nodes[0].id.length).toBeGreaterThan(10);
      expect(result.nodes[1].id).toEqual("0");
    });
  });
});
