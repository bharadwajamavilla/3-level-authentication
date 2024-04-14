const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const imageSchema = require("../models/imageSchema");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// email config
const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const calculateHash = (filePath) => {
  const imageData = fs.readFileSync(filePath);
  const sha256Hash = crypto.createHash("sha256");
  sha256Hash.update(imageData);
  return sha256Hash.digest("hex");
};

const getHuff = (str) => {
  class Node {
    constructor(data = "", freq = 0) {
      this.data = data;
      this.freq = freq;
      this.code = "";
      this.left = null;
      this.right = null;
    }
  }

  class Huffman {
    constructor(str) {
      this.inStr = str;
      this.root = null;
      this.minHeap = [];
      this.arr = [];
      this.idx = {};
      this.N = str.length;
      this.createCharArr();
    }

    createCharArr() {
      let n,
        digit = "0".charCodeAt(0),
        ch,
        l = 0;
      for (let i = 0; i <= 9; i++) {
        n = new Node(String.fromCharCode(digit + i), 0);
        this.arr.push(n);
        this.idx[String.fromCharCode(digit + i)] = l;
        l++;
      }
      ch = "@".charCodeAt(0);
      for (let j = 1; j <= 26; j++) {
        n = new Node(String.fromCharCode(ch + j), 0);
        this.arr.push(n);
        this.idx[String.fromCharCode(ch + j)] = l;
        l++;
      }
      ch = "`".charCodeAt(0);
      for (let k = 1; k <= 26; k++) {
        n = new Node(String.fromCharCode(ch + k), 0);
        this.arr.push(n);
        this.idx[String.fromCharCode(ch + k)] = l;
        l++;
      }
    }

    frequencyCreation() {
      let ch, index;
      for (let i = 0; i < this.N; i++) {
        ch = this.inStr[i];
        index = this.idx[ch];
        this.arr[index].freq++;
      }
    }

    minHeapCreation() {
      this.minHeap = this.arr
        .filter((node) => node.freq > 0)
        .sort((a, b) => a.freq - b.freq);
    }

    treeCreation() {
      while (this.minHeap.length > 1) {
        let left = this.minHeap.shift();
        let right = this.minHeap.shift();
        let newNode = new Node();
        newNode.freq = left.freq + right.freq;
        newNode.left = left;
        newNode.right = right;
        this.minHeap.push(newNode);
        this.minHeap.sort((a, b) => a.freq - b.freq);
      }
      this.root = this.minHeap[0];
    }

    codesCreation(node, huff) {
      if (node.left === null && node.right === null) {
        node.code = huff;
        return;
      }
      this.codesCreation(node.left, huff + "0");
      this.codesCreation(node.right, huff + "1");
    }

    getBinStr() {
      let huffcode,
        tmp = "",
        ch,
        index;
      for (let i = 0; i < this.N; i++) {
        ch = this.inStr[i];
        index = this.idx[ch];
        huffcode = this.arr[index].code;
        tmp += huffcode;
      }
      return tmp;
    }

    getByteStr(binStr) {
      let tmp = binStr;
      let m = binStr.length;
      let rem = m % 8;
      let bits = 8 - rem;
      tmp = tmp.padEnd(tmp.length + bits, "0");
      return tmp;
    }

    binToDec(inStr) {
      return parseInt(inStr, 2);
    }

    getEncryptedStr(byteStr) {
      let tmp = "";
      for (let i = 0; i < byteStr.length; i += 8) {
        tmp += String.fromCharCode(this.binToDec(byteStr.substring(i, i + 8)));
      }
      return tmp;
    }

    hash() {
      this.frequencyCreation();
      this.minHeapCreation();
      this.treeCreation();
      this.codesCreation(this.root, "");

      let binStr = this.getBinStr();
      let byteStr = this.getByteStr(binStr);
      let encryptedStr = this.getEncryptedStr(byteStr);
      return encryptedStr;
    }
  }

  let s = str;
  let h = new Huffman(s);
  let enStr = h.hash();
  // console.log("encoded str:", enStr);
  // console.log(enStr.length);
  // let t = enStr;
  // console.log(enStr === t ? "True" : "False");

  return enStr;
};

const deleteFiles = () => {
  const folderPath = "uploads";

  // Read the files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      //console.error(`Error reading folder: ${err}`);
      return;
    }

    // Iterate through the files and delete each one
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          //console.error(`Error deleting file ${filePath}: ${err}`);
        } else {
          //console.log(`File ${filePath} deleted successfully`);
        }
      });
    });
  });
};

const iterateAndCalculateHashes_register = (email) => {
  let hash_str = "";
  fs.readdir("./uploads", (err, files) => {
    if (err) {
      console.error("Error reading the uploads folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join("./uploads", file);
      const hashResult = calculateHash(filePath);
      hash_str += hashResult;
    });

    console.log("hash_str : ", hash_str);
    console.log(hash_str.length);

    // Call the Huffman function after hash calculation
    const huff_code = getHuff(hash_str);

    console.log("huff_code: ", huff_code);
    console.log(huff_code.length);

    // Now, call the function to delete files
    // deleteFiles();

    const newImageSchema = new imageSchema({
      email: email,
      imageHash: huff_code,
    });
    // Save the new user to the database
    newImageSchema
      .save()
      .then((savedUser) => {
        console.log("image saved:", savedUser);
      })
      .catch((error) => {
        console.error("Error saving image:", error);
      });

    deleteFiles();
  });
};

exports.imageUpload = (req, res) => {
  console.log("req.body", req.body);
  const imageCount = req.body.imageCount;
  const email = req.body.email;

  if (req.file) {
    if (imageCount === "1") {
      return res
        .status(200)
        .json({ message: "File uploaded successfully", imageCount: 1 });
    } else if (imageCount === "2") {
      iterateAndCalculateHashes_register(email);

      return res.status(200).json({ message: "Registered", imageCount: 2 });
    }
  }

  return res.status(500).json({ message: "Unable to submit" });
};

const iterateAndCalculateHashes_login = (email) => {
  return new Promise((resolve, reject) => {
    console.log("entered login image");
    let hash_str = "";
    fs.readdir("./uploads", (err, files) => {
      if (err) {
        console.error("Error reading the uploads folder:", err);
        reject("Error reading the uploads folder");
        return;
      }

      files.forEach((file) => {
        const filePath = path.join("./uploads", file);
        const hashResult = calculateHash(filePath);
        hash_str += hashResult;
      });

      const huff_code = getHuff(hash_str);
      console.log(huff_code);

      // Check credentials in the database using promises
      imageSchema
        .findOne({ email: email })
        .then((user) => {
          console.log("User found:", user);
          if (!user) {
            console.log("User not found");
            resolve(false);
            return;
          }

          // Compare password
          if (user.imageHash === huff_code) {
            console.log("Login successful");
            resolve("success");
          } else {
            console.log("bd password : ", user.imageHash);
            console.log("entered password : ", huff_code);
            console.log("Incorrect password");
            resolve("failed");
          }
        })
        .catch((err) => {
          console.error("Error finding user:", err);
          reject("Error finding user");
        })
        .finally(() => {
          // Perform cleanup, e.g., delete files
          deleteFiles();
        });
    });
  });
};

exports.loginImageUpload = async (req, res) => {
  const imageCount = req.body.imageCount;
  const email = req.body.email;

  if (req.file) {
    if (imageCount === "1") {
      return res
        .status(200)
        .json({ message: "File uploaded successfully", imageCount: 1 });
    } else if (imageCount === "2") {
      try {
        const isValid = await iterateAndCalculateHashes_login(email);
        console.log("isValid", isValid);
        if (isValid === "success") {
          return res
            .status(200)
            .json({ message: "Loggedin sucessfully", imageCount: 2 });
        } else {
          return res.status(400).json({ message: "Incorrect password" });
        }
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Error logging in" });
      }
    }
  }

  return res.status(500).json({ message: "Unable to submit" });
};
exports.userregister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "Please Enter All the Input fields" });
  }

  try {
    const presuer = await users.findOne({ email: email });

    if (presuer) {
      res.status(400).json({ error: "User Already exists" });
    } else {
      const userregister = new users({
        username,
        email,
        password,
      });

      // here password hasing

      const storeData = await userregister.save();
      res.status(200).json(storeData);
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Credentials", error });
  }
};

//user login pass
exports.userloginpass = async (req, res) => {
  const user = await users.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ error: "Email not found" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ error: "Invalid password" });
  }

  // Generate token here, assuming you have a function called generateToken
  // const token = generateToken(user);

  return res.status(200).json({ message: "Login successful" });
};

// user send otp
exports.userOtpSend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Please Enter Your Email" });
  }

  try {
    const presuer = await users.findOne({ email: email });

    if (presuer) {
      const OTP = Math.floor(100000 + Math.random() * 900000);
      console.log(OTP);

      const existEmail = await userotp.findOne({ email: email });

      if (existEmail) {
        console.log("email exist");
        const updateData = await userotp.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateData.save();

        console.log("saved successfully");

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Email For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
          console.log("entered transporter");
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "Email not sent" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      } else {
        const saveOtpData = new userotp({
          email,
          otp: OTP,
        });

        await saveOtpData.save();
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Email For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "Email not sent" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      }
    } else {
      res.status(400).json({ error: "User does not Exist" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Credentials", error });
  }
};

// user login otp
exports.userLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and email" });
  }

  try {
    const otpverification = await userotp.findOne({ email: email });

    if (otpverification.otp === otp) {
      const preuser = await users.findOne({ email: email });
      const userName = preuser.username;
      // token generate
      const token = await preuser.generateAuthtoken();
      res
        .status(200)
        .json({ message: "Login Succesfull", userToken: token, userName });
    } else {
      res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Credentials", error });
  }
};
