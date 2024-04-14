const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false); // to avoid deprecation warning

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log("error", error);
  });
