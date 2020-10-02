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

const axios = require("axios").default;
const cheerio = require("cheerio")

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
  const PetSpecies = [];

    try {
      const response = await axios.get('https://dogtime.com/dog-breeds/profiles')
      const $ = cheerio.load(response.data)
      $('.article-crumbs > .list-item').map((i,el)=>{
        PetSpecies.push($(el).text())
      })
    } catch (error) {
      console.log(error);
    }
  
  if(!req.files){
    return res.send('image must not be empty')
  }
  try {
    const { image } = req.files;
    const fileName = imageName(image);

    await image.mv(`./src/images/${fileName}`);
    const imagePath = path.join(`./src/images/${fileName}`);
    const result = await imageClassification(imagePath,PetSpecies);
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

const imageClassification = async (imagePath,PetSpecies) => {
  const image = readImage(imagePath);
  return new Promise(async(resolve, reject) => {
    try {
      // Load the model.
      const mobilenetModel = await mobilenet.load();
      // Classify the image.
      const predictions = await mobilenetModel.classify(image);
      // console.log("Classification Results:", predictions);
      const name1 = nameCase(predictions[0].className.toString());
      const name2 = nameCase(predictions[1].className.toString());
      const name3 = nameCase(predictions[2].className.toString());
      // let result = PetSpecies.some(i => i === name1 || name2 === name3)
    //   console.log(PetSpecies);
      let result = false;
      for(let i of PetSpecies){
        if(name1.search(i) !== -1 || name2.search(i) !== -1 || name3.search(i) !== -1){
            result = true;
            break;
        }
        if(name1.includes('Cat') || name2.includes('Cat') || name3.includes('Cat')){
            result = true;
            break;
          }
      }
      console.log(` ------ \n${result}`);
      return resolve(predictions);
    } catch (error) {
      return reject(error)
    }
  })
};

const nameCase = (name) =>{
  var splitName = name.toLowerCase().split(' ')
  for(let i = 0; i < splitName.length;i++){
    splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1)
  }
  return splitName.join(' ')
}