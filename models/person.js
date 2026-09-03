import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const url = process.env.URL;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength:[3, "Name must be at least 3 characters long"],
    required: true
  },
  number: {
    type: String,
    minLength: [8, "Phone must be at least 8 characters long"],
    validate: {
      validator: function(v){
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: true
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
