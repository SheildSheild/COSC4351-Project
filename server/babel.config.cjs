module.exports = 
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],

    "@babel/preset-react",

    [
      "babel-preset-vite",
      {
        "env": true,
        "glob": false
      }
    ]
  ],
  plugins: [
    "babel-plugin-transform-import-meta"
  ]
}