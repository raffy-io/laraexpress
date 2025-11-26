export default {
  tailwind: {
    input: "./src/css/input.css",
    output: "./public/css/output.css",
    watch: true,
  },
  browserSync: {
    proxy: "localhost:8080",
    files: ["public/**/*", "app/Views/**/*.edge"],
    options: {
      ui: false,
      notify: false,
      reloadDelay: 200,
      injectChanges: false,
      snippet: false,
    },
  },
  nodemon: {
    script: "app.js",
    watch: ["app"],
    ext: "js,edge",
  },
};
