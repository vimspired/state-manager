import { generateState } from "./fixture";
import { setText } from "../index";

describe("setText", () => {
  test("set text for current node", () => {
    const state = generateState({ currentPath: [1, 1] });
    const result = setText("New text!")(state);

    expect(result.nodes[1].nodes[1].text).toEqual("New text!");
  });
});
