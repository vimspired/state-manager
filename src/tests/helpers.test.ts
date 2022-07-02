import { generateNode, generateState } from "./fixture";
import { insertNodeAt } from "../helpers";

describe("helpers", () => {
  describe("insertNodeAt", () => {
    test("insert first in top-level", () => {
      const state = generateState();
      const node = generateNode("new-node");

      const result = insertNodeAt(node, [0])(state);

      expect(result.nodes[0].id).toEqual("new-node");
      expect(result.nodes[1].id).toEqual("0");
    });

    test("insert last in top-level", () => {
      const state = generateState();
      const node = generateNode("new-node");

      const result = insertNodeAt(node, [5])(state);

      expect(result.nodes[5].id).toEqual("new-node");
    });

    test("insert first in nested", () => {
      const state = generateState();
      const node = generateNode("new-node");

      const result = insertNodeAt(node, [1, 1, 0])(state);

      expect(result.nodes[1].nodes[1].nodes[0].id).toEqual("new-node");
      expect(result.nodes[1].nodes[1].nodes[1].id).toEqual("1,1,0");
    });

    test("insert last in nested", () => {
      const state = generateState();
      const node = generateNode("new-node");

      const result = insertNodeAt(node, [1, 2, 2])(state);

      expect(result.nodes[1].nodes[2].nodes[2].id).toEqual("new-node");
    });
  });
});
