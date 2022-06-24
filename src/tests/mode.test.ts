import { generateState } from "./fixture";
import { Mode, normalMode, insertMode } from "../index";

describe("mode", () => {
  test("enter insert mode", () => {
    const state = generateState({ mode: Mode.Normal });
    const result = insertMode(state);

    expect(result.mode).toEqual(Mode.Insert);
  });

  test("enter normal mode", () => {
    const state = generateState({ mode: Mode.Insert });
    const result = normalMode(state);

    expect(result.mode).toEqual(Mode.Normal);
  });

  test("remove node if empty", () => {
    const state = generateState({ currentPath: [1, 0], mode: Mode.Insert });
    expect(state.nodes[1].nodes.length).toBe(3);
    const result = normalMode(state);

    expect(result.nodes[1].nodes.length).toBe(2);
  });

  test("doesn't remove node if it's not empty", () => {
    const state = generateState({ currentPath: [1, 0], mode: Mode.Insert });
    state.nodes[1].nodes[0].text = "Some text.";
    expect(state.nodes[1].nodes.length).toBe(3);
    const result = normalMode(state);

    expect(result.nodes[1].nodes.length).toBe(3);
  });

  test("doesn't remove node if it has children", () => {
    const state = generateState({ currentPath: [1, 1], mode: Mode.Insert });
    expect(state.nodes[1].nodes.length).toBe(3);
    const result = normalMode(state);

    expect(result.nodes[1].nodes.length).toBe(3);
  });
});
