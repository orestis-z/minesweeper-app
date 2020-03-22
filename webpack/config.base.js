import path from "path";
// import fs from "fs";
import webpack from "webpack";
import { config } from "dotenv";
import ENVS from "../envs.json";
import PLATFORMS from "../platforms.json";

export const appDirectory = path.resolve(__dirname, "../");

export const pathResolveAppdir = (src = "") => path.resolve(appDirectory, src);
const envFilePath = pathResolveAppdir(".env");

const envVars = {
  ...config({ envFilePath }).parsed,
  ...ENVS[process.env.ENV],
  ...PLATFORMS[process.env.PLATFORM],
  ...process.env,
};

// let ignoreFilenames = fs.readdirSync(
//   pathResolveAppdir( "node_modules"),
// );
// const includeFilenames = [
//   "@ptomasroos",
//   "react-native-render-html",
//   "react-native-elements",
// ];
// includeFilenames.forEach(fileName => {
//   const index = ignoreFilenames.indexOf(fileName);
//   if (index > -1) {
//     console.info("removing " + fileName);
//     ignoreFilenames.splice(index, 1);
//   } else console.warn(fileName + " not found");
// });
// ignoreFilenames = ignoreFilenames.map(fileName => "node_modules/" + fileName);

const MAX_ASSET_BASE_64 = 10 * 1000; // Convert assets < 10kb to base64 strings

export const entryCommon = [
  pathResolveAppdir("node_modules/core-js/modules/es6.promise"),
  pathResolveAppdir("node_modules/core-js/modules/es6.array.iterator"),
];

export default {
  entry: {
    src: [pathResolveAppdir("src/index.web.js"), ...entryCommon],
  },
  output: {
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          pathResolveAppdir("src"),
          pathResolveAppdir("node_modules/react-native-menu"),
          pathResolveAppdir("node_modules/react-native-webview"),
          pathResolveAppdir("node_modules/react-native-dialog"),
          pathResolveAppdir("node_modules/react-native-modal"),
          pathResolveAppdir("node_modules/react-native-elements"),
          pathResolveAppdir("node_modules/react-native-otp-inputs"),
          pathResolveAppdir("node_modules/react-native-popup-menu"),
          pathResolveAppdir("node_modules/react-native-material-dialog"),
          pathResolveAppdir("node_modules/react-native-code-push"),
          pathResolveAppdir("node_modules/react-native-vector-icons"),
          pathResolveAppdir("node_modules/react-native-tab-navigator"),
          pathResolveAppdir("node_modules/react-native-admob"),
          pathResolveAppdir(
            "node_modules/@react-native-community/async-storage",
          ),
          pathResolveAppdir(
            "node_modules/@ptomasroos/react-native-multi-slider",
          ),
          pathResolveAppdir("node_modules/modal-enhanced-react-native-web"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-flow"],
            cacheDirectory: true,
            plugins: [
              "@babel/plugin-proposal-export-namespace-from",
              "lodash",
              "react-native-web",
            ],
            comments: true, // uncomment to name chunks
          },
        },
      },
      {
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.(gif|jpe?g|png|svg|webp)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[hash].[ext]",
          },
        },
      },
      {
        test: /\.ico$/,
        use: {
          loader: "file-loader",
          options: {},
        },
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: MAX_ASSET_BASE_64,
              name: "[name].[hash].[ext]",
            },
          },
        ],
        include: [
          path.resolve(
            appDirectory,
            "node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf",
          ),
          pathResolveAppdir("src/assets/fonts"),
        ],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: "css-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "react-native$": "react-native-web",
      "react-native-webview$": "src/components/Fallback",
      "react-native-cookies$": "src/components/Fallback",
      "react-native-device-detection": "src/components/Fallback",
      "react-native-modal": "modal-enhanced-react-native-web",
      "./ToastStyles$": "./ToastStyles.android",
      "react-native-config": "react-web-config",
      "@react-native-community/async-storage-backend-legacy":
        "@react-native-community/async-storage-backend-web",
    },
    modules: [
      pathResolveAppdir(),
      pathResolveAppdir("src/entries"),
      pathResolveAppdir("node_modules"),
    ],
    extensions: [".web.js", ".js"],
  },
  plugins: [
    // needed for react-native-config
    new webpack.DefinePlugin({
      __REACT_WEB_CONFIG__: JSON.stringify(envVars),
    }),
  ],
};
