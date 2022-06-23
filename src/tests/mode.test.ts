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
});
