# Machine Learning in Expressjs with TensorFlow.js
A simple example on Image Classification in Expressjs using TensorFlow.js.
TensorFlow is an end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML powered applications.

## Installation

1.  Clone this repository
```
git clone https://github.com/febryardiansyah/express-image-classification
```

2. Install dependencies
```
npm install
```

3. Run server
use `npm run start` or `npm run dev`

## Testing
You can use api tester such as [Postman](https://www.postman.com/downloads/) and open http://localhost:3000/ with `Post` method.
Then, select menu `Body` and choose `form-data`. Input `image` as key and change to `file`, then for value you can choose image from
your directory.

For exemple, i'm using this image https://www.humanesociety.org/sites/default/files/styles/1240x698/public/2019/03/rabbit-475261_0.jpg?h=c855054e&itok=lfjXk4-x
![](https://www.humanesociety.org/sites/default/files/styles/1240x698/public/2019/03/rabbit-475261_0.jpg?h=c855054e&itok=lfjXk4-x)

- The result will be shown in Postman as :

```json
[
    {
        "className": "Angora, Angora rabbit",
        "probability": 0.781345784664154
    },
    {
        "className": "wood rabbit, cottontail, cottontail rabbit",
        "probability": 0.11294354498386383
    },
    {
        "className": "hare",
        "probability": 0.09289330244064331
    }
]
```

![](https://media.discordapp.net/attachments/293767021030670356/758965683677298688/unknown.png?width=1326&height=951)

## Contribute
Contributors of any kind are welcome. Share your awesome improvements in a pull request and join our mission to make Machine Learning more affordable & accessible!