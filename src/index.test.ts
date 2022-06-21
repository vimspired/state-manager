import { myfun } from "./index";
describe("index", () => {
  describe("myfun", () => {
    test("it works", () => {
      const result = myfun();

      expect(result).toEqual("my function");
    });
  });
});
