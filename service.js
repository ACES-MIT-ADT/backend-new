import e from "express";
import mongoose from "mongoose";
import {
  LeadershipModel,
  TimelineModel,
  GalleryModel,
  ContactModel,
  database,
  BlogModel,
  RegisterModel,
  EmailModel,
} from "./DB.js";

// Function to add an image
async function LeadershipS(Name, Image, Position, Description, Link) {
  try {
    const LS = new LeadershipModel({
      Name,
      Image,
      Position,
      Description,
      Link,
    });
    await LS.save();
    console.log("Leadership Collection added successfully");
  } catch (err) {
    console.error("Error adding Leadership Collection:", err);
  }
}

// Function to add a form submission
async function TimelineS(Title, Description, Year) {
  try {
    const TS = new TimelineModel({ Title, Description, Year });
    await TS.save();
    console.log("Timeline collection added successfully");
  } catch (err) {
    console.error("Error adding Timeline collection: ", err);
  }
}

async function GalleryS(Image) {
  try {
    const TS = new GalleryModel({ Image });
    await TS.save();
    console.log("Gallery collection added successfully");
  } catch (err) {
    console.error("Error adding Gallery collection: ", err);
  }
}

async function BannerS(Title, Image, Description, BText) {
  try {
    const TS = new BannerModel({ Title, Image, Description, BText });
    await TS.save();
    console.log("BannerModel collection added successfully");
  } catch (err) {
    console.error("Error adding BannerModel collection: ", err);
  }
}

async function BannerNLS(Title, Image, Description, BText) {
  try {
    const TS = new BannerNLModel({ Title, Image, Description, BText });
    await TS.save();
    console.log("BannerNL collection added successfully");
  } catch (err) {
    console.error("Error adding BannerNL collection: ", err);
  }
}

// New Web

async function ContactS(Name, Email, Message) {
  try {
    const TS = new ContactModel({ Name, Email, Message });
    await TS.save();
    console.log("Contact collection added successfully");
  } catch (err) {
    console.error("Error adding Contact collection: ", err);
  }
}

async function BlogS(Content, Image, Author) {
  try {
    const TS = new BlogModel({ Content, Image, Author });
    await TS.save();
    console.log("Blog collection added successfully");
  } catch (err) {
    console.error("Error adding Blog collection: ", err);
  }
}

async function RegisterS(Name, Email, Number, Entroll, _Div) {
  try {
    const TS = new RegisterModel({ Name, Email, Number, Entroll, _Div });
    await TS.save();
    console.log("Register collection added successfully");
  } catch (err) {
    console.error("Error adding Register collection: ", err);
  }
}

async function EmailS(Name, Email, Number) {
  try {
    const TS = new EmailModel({ Name: Name, Email: Email, Number: Number });
    await TS.save();
    console.log("NodeMail collection added successfully");
  } catch (err) {
    console.error("Error adding NodeMail collection: ", err);
  }
}

// Read Data

const FetchData = async (model, query = {}) => {
  try {
    // Dynamically fetch the model by name
    const Model = database.model(model);
    const doc = await Model.find(query); // `.find()` directly returns an array of documents
    return doc;
  } catch (err) {
    console.log("Error in Fetch:", err);
  }
};

async function UpdateData(userId, updateData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    console.log("Updated User:", updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function DeleteData(userId) {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log("Deleted User:", deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

export {
  LeadershipS,
  TimelineS,
  GalleryS,
  BannerS,
  BannerNLS,
  ContactS,
  FetchData,
  RegisterS,
  BlogS,
  EmailS,
  UpdateData,
  DeleteData,
};
