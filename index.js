import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import { config } from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { DeleteData, FetchData, UpdateData } from "./service.js";
import { BlogModel, ContactModel, EmailModel } from "./DB.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
config();
// app.set("view engine", "ejs");
//app.use(express.static('public'));
// app.set("files", path.join(__dirname, "views"));
// app.set("views", path.join(__dirname, "views/blog"));

//blogs page server routes
// Routes user blog posts
app.get("/blog/posts", async (req, res) => {
  try {
    const approvedPosts = await FetchData("Blog", { approved: true });
    res.send(approvedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// 1. Post a new blog/quote (User)
app.post("/blog/create", async (req, res) => {
  try {
    let { content, image, author } = req.body;
    console.log(content, image, author);

    // Check and format image if necessary
    if (typeof image === "object") {
      image = JSON.stringify(image);
    }

    // Validate that all fields are present and strings
    if (typeof content !== "string" || typeof author !== "string") {
      return res
        .status(400)
        .json({ message: "Content and Author should be strings" });
    }

    // Create a new post instance
    const newPost = new BlogModel({
      Content: content,
      Image: image,
      Author: author,
    });

    // Save to database
    await newPost.save();
    console.log(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
});

// 2. Get all posts (Admin only)
app.get("/blog/admin/posts", async (req, res) => {
  try {
    const posts = await FetchData("Blog");
    res.status(201).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// 3. Approve/Disapprove a post (Admin)
app.post("/blog/admin/post/update", async (req, res) => {
  try {
    const postId = req.body.id;
    const approved = req.body.approved === "true"; // or use req.body.approved if already boolean
    const _data = req.body;

    console.log(_data);

    if (approved) {
      // Approve post
      if (_data) {
        await UpdateData(postId, _data);
      }
    } else {
      // Disapprove and delete post
      await DeleteData(postId);
    }

    return res.status(201).json({ msg: "Success" });
  } catch (error) {
    console.error("Error updating post:", error); // Log error to understand what went wrong
    return res.status(500).json({ message: "Error updating post", error });
  }
});

app.delete("/blog/admin/post/delete", async (req, res) => {
  try {
    const postId = req.body.id;

    await DeleteData(postId);
    res.status(201).json({ msg: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// 4. Get only approved posts for main site
// app.get("/blog/posts", async (req, res) => {
//   try {
//     const approvedPosts = await FetchData("blog", { approved: true });
//     res.json(approvedPosts);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching approved posts", error });
//   }
// });

// Node mailer api

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tanyshah0@gmail.com",
    pass: "sxfuhodroizzntdp",
  },
});

// app.get("/nodemailer/registration", (req, res) => {
//   res.json(s");
// });

app.post("/nodemailer/registration", async (req, res) => {
  const { name, email, number } = req.body;

  // Save to MongoDB
  try {
    let newEmail = new EmailModel({ Name: name, Email: email, Number: number }); // cont or Save Email
    await newEmail.save();
    // console.log("Data saved to MongoDB");

    // Emit event to client
    io.emit("newSubmission", newEmail);

    // Send thank-you email
    const mailOptions = {
      from: "tanyshah0@gmail.com",
      to: email,
      subject: "Thank You for Registering for Vision Voyage!",
      html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Hi ${name},</p>
                <p>Thank you for registering for Vision Voyage!<  br> We’re excited to welcome you to this event and look forward to an inspiring day filled with exploration and learning.</p>
                <p>Please find your entry pass attached below <br>. You’ll need to present this pass for entry into the event.</p>
                <p>Event Details:</p>
                <p>Venue: SOC-N518</p>
                <p>Timing: 10:30 AM - 3:30 PM</p>
                <p>Thank you for trusting ACES to be part of your journey. We can’t wait to see you there!</p>
                <p>Best Regards</p>
                <p>Team ACES</p>
                <img src="cid:logoImage" alt="Logo" style="width: 1000px; height: auto;">
            </div>
        `,
      attachments: [
        {
          filename: "logo1.png",
          path: "./image/logo1.png",
          cid: "logoImage",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error sending email");
        return;
      } else {
        console.log("Email sent: " + info.response);
        // res.redirect("/nodemailer/registration");
        res.json({ msg: error });
      }
    });
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    res.status(500).send("Failed to save data");
  }
});

//contact us

// Serve the HTML file
// app.get("/contact/contactus", (req, res) => {
//   res.sendFile(__dirname + "/contactus.html");
// });
app.post("/contact/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log(name, email, message);

    // Validate input fields
    if (!name || !email || !message) {
      return res
        .status(400)
        .send(
          '<script>alert("All fields are required!"); window.location.href = "/";</script>'
        );
    }

    // Check if the email ends with @gmail.com
    if (!email.endsWith("@gmail.com")) {
      return res
        .status(400)
        .send(
          '<script>alert("Email must end with @gmail.com"); window.location.href = "/";</script>'
        );
    }

    // Create a new contact document
    const newContact = new ContactModel({
      Name: name,
      Email: email,
      Message: message,
    });

    // Save to MongoDB
    await newContact.save();

    // Send success response
    console.log("Contact Saved");
    res.status(201).json({ msg: "Contact Saved" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        '<script>alert("Error connecting with us. Please try again later!"); window.location.href = "/";</script>'
      );
  }
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
