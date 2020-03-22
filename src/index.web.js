import { AppRegistry } from "react-native";

import Root from "./layouts";

if (__DEV__) Promise = require("bluebird"); // better warnings for promises

AppRegistry.registerComponent("Minesweeper", () => Root);
AppRegistry.runApplication("Minesweeper", {
  rootTag: document.getElementById("root"),
});
