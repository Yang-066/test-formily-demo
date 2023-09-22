// 'use strict'
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}
// // 引入基础fs模块
// const fs = require("fs-extra");
// const getWorkspaceAlias = () => {
//   // 获取工作区别名
//   const basePath = resolve(__dirname, "../"); // 项目根目录
//   const pkg = fs.readJSONSync(resolve(basePath, "package.json")) || {}; // 读取package.json
//   const alias = {}; // 别名配置
//   const workspaces = pkg.workspaces; // 读取package.json中的workspaces
//   if (Array.isArray(workspaces)) {
//     // 如果workspaces是数组
//     workspaces.forEach((pattern) => {
//       // 遍历workspaces
//       const { found } = new GlobSync(pattern, { cwd: basePath }); // 使用glob匹配文件夹
//       found.forEach((name) => {
//         // 遍历匹配到的文件夹
//         try {
//           // 尝试读取package.json
//           const pkg = fs.readJSONSync(
//             // 读取package.json
//             resolve(basePath, name, "./package.json") // package.json路径
//           );
//           alias[`${pkg.name}/esm`] = resolve(basePath, name, "./esm"); // 配置别名
//           alias[pkg.name] = resolve(basePath, name, "./src"); // 配置别名
//         } catch (error) {
//           /* empty */
//         }
//       });
//     });
//   }
//   return alias;
// };
const name = defaultSettings.title || "Certificate-inquiry";
const port = process.env.port || process.env.npm_config_port;

module.exports = {
  publicPath: "./",
  outputDir: process.env.NODE_ENV === "development" ? "dist" : "ecert-portal",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    host: "localhost",
    proxy: {
      "": {
        // target: 'https://data.gdgov.cn', // 生产环境
        target: "http://xtbgzww.digitalgd.com.cn", // 测试环境
        changOrigin: true,
        headers: {
          origin: "http://xtbgzww.digitalgd.com.cn",
        },
      },
    },
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": path.resolve("src"),
        // ...getWorkspaceAlias(),
        // "@designable/core": path.resolve(`@designable/core`),
        // "@formily/element-settings-form": path.resolve(
        //   `@formily/element-settings-form`
        // ),
        // "@formily/element": path.resolve(`@formily/element`),
        "@formily/element-designable": path.resolve(
          `@formily/element-designable`
        ),
        // "@designable/formily-transformer": path.resolve(
        //   `@designable/formily-transformer`
        // ),
        // "@vue/composition-api": path.resolve(`@vue/composition-api`),
        // "@formily/reactive-vue": path.resolve(`@formily/reactive-vue`),
        // "@formily/element-prototypes": path.resolve(
        //   `@formily/element-prototypes`
        // ),
        // "@formily/reactive": path.resolve(`@formily/reactive`),
        // "@formily/core": path.resolve(`@formily/core`),
        // "@formily/shared": path.resolve(`@formily/shared`),
      },
    },
  },
  transpileDependencies: [],
  chainWebpack(config) {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icon")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            inline: /runtime\.*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), //
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
  },
};
