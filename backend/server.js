"use strict";

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, function () {
  console.debug(`Started on http://localhost:${PORT}`);
});