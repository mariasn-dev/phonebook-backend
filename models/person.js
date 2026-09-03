import URL from "../.env";

import mongoose from "mongoose";

mongoose.set("strictQuery", false);

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = new mongoose.model("Person", personSchema);

export default Person;
