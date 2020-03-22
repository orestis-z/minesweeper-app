import { each } from "lodash";

export default cells => {
  const lines = [""];
  each(cells, row => {
    const cell_values = [];
    each(row, cell_value => {
      cell_values.push(cell_value);
    });
    lines.push(cell_values.join(" "));
  });
  lines.push("");
  return lines.join("\n");
};
