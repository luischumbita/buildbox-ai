/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    serverModuleFormat: "esm",
    serverDependenciesToBundle: [
        // no bundles needed for client-only libs; ensure SSR does not import them
        "nanostores",
        "@nanostores/react",
        "isomorphic-git",
        "jszip",
        "file-saver",
        "shiki",
        "path-browserify",
        "buffer",
        "process",
        "util",
        "stream"
    ],
    // appDirectory: "app",
    // assetsBuildDirectory: "public/build",
    // publicPath: "/build/",
    // serverBuildPath: "build/index.js",
};
