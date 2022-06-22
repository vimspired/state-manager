import { OutlinerState, OutlinerNode, Mode } from "../index";

export const generateNode = (
  id: string,
  overrides: any = {}
): OutlinerNode => ({
  id,
  name: "",
  nodes: [],
  ...overrides,
});

export const generateState = (overrides: any = {}): OutlinerState => ({
  currentPath: [0],
  mode: Mode.Normal,
  nodes: [
    generateNode("0"),
    generateNode("1", {
      nodes: [
        generateNode("1,0"),
        generateNode("1,1", {
          nodes: [generateNode("1,1,0")],
        }),
        generateNode("1,2", {
          nodes: [generateNode("1,2,0"), generateNode("1,2,1")],
        }),
      ],
    }),
    generateNode("2", { folded: true }),
    generateNode("3", {
      folded: true,
      nodes: [generateNode("3,0"), generateNode("3,1")],
    }),
    generateNode("4"),
  ],
  ...overrides,
});
