import "module-alias/register";
import e = require("express");

const app = e();

app.use(e.json()); // for parsing application/json
app.use(e.urlencoded({ extended: true }));

const PORT = 9000;

app.listen(PORT, () : void => {
  console.info({ message : `we're listening on port ${PORT}` });
});
