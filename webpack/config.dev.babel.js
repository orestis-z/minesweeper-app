import chalk from "chalk";
import path from "path";
import webpack from "webpack";
import baseConfig, { appDirectory } from "./config.base";
import merge from "webpack-merge";
import ENVS from "../envs.json";
import PLATFORMS from "../platforms.json";

const ENV_INFO = ENVS[process.env.ENV];
const PLATFORM_INFO = PLATFORMS[process.env.PLATFORM];
Object.keys(PLATFORM_INFO).forEach(k => {
  ENV_INFO[k] = PLATFORM_INFO[k];
});
console.log(chalk.blueBright("Environment:"));
console.log(ENV_INFO);

export default merge.smart(baseConfig, {
  devtool: "inline-source-map",
  devServer: {
    publicPath: "/",
    contentBase: [
      path.resolve(appDirectory, "web/src"),
      path.resolve(appDirectory, "data"),
    ],
    watchContentBase: true,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: ENV_INFO.DEV,
    }),
  ],
});
