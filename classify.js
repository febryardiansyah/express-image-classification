//server side nodejs framework
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const app = express();

//TensorFlow.js is an open-source hardware-accelerated JavaScript library
//for training and deploying machine learning models.
const tf = require("@tensorflow/tfjs");
//MobileNet : pre-trained model for TensorFlow.js
const mobilenet = require("@tensorflow-models/mobilenet");
//The module provides native TensorFlow execution
//in backend JavaScript applications under the Node.js runtime.
const tfnode = require("@tensorflow/tfjs-node");
//The modules provide an API for interacting with the file system.
const fs = require("fs");
const path = require("path");

//changing image name to date
const imageName = require("./src/helpers/imageName");

//server port
const port = 3000;

//tell express to use these middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//post method
app.post("/", async (req, res) => {
  if(!req.files){
    return res.send('image must not be empty')
  }
  try {
    const { image } = req.files;
    const fileName = imageName(image);

    await image.mv(`./src/images/${fileName}`);
    const imagePath = path.join(`./src/images/${fileName}`);
    const result = await imageClassification(imagePath);
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
});

//run server
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

const readImage = (imagePath) => {
  //reads the entire contents of a file.
  //readFileSync() is synchronous and blocks execution until finished.
  const imageBuffer = fs.readFileSync(imagePath);
  //Given the encoded bytes of an image,
  //it returns a 3D or 4D tensor of the decoded image. Supports BMP, GIF, JPEG and PNG formats.
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
};

const imageClassification = async (imagePath) => {
  const image = readImage(imagePath);
  return new Promise(async(resolve, reject) => {
    try {
      // Load the model.
      const mobilenetModel = await mobilenet.load();
      // Classify the image.
      const predictions = await mobilenetModel.classify(image);
      console.log("Classification Results:", predictions);
      // const result = predictions.map((p) => {
      //   if (p.className.includes("cat") || p.className.includes("dog")) {
      //     return true;
      //   }
      //   return false;
      // });
      return resolve(predictions);
    } catch (error) {
      return reject(error)
    }
  })
};
