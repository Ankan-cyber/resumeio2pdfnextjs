// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import imgToPDF from 'image-to-pdf';
import request from 'request';
import fetch from 'node-fetch';
import fs from 'fs'
import path from 'path'

path.join(process.cwd(), 'images');
path.join(process.cwd(), 'pdfs');

const downloadImage = (url, fileName) => {
  return new Promise((resolve, reject) => {
    request.get(url.toString())
      .on("error", (err) => {
        reject(err);
      })
      .pipe(fs.createWriteStream(fileName))
      .on("close", () => {
        resolve();
      });
  });
};

const makePDF = (images, sid) => {
  return new Promise((resolve, reject) => {
    try {
      imgToPDF(images, imgToPDF.sizes.A4)
        .pipe(fs.createWriteStream(`./public/pdfs/${sid}.pdf`))
      resolve();
    }
    catch (err) {
      reject(err)
    }
  })
}

export default async function handler(req, res) {
  if (req.method == "POST") {
    let success = false;
    const url = JSON.parse(req.body).url;
    const reURL = /^https:\/\/resume[.]io\/r\/([\w]+)/;
    const isValidURL = reURL.test(url);
    //matching the url
    if (!isValidURL) {
      res.status(400).json({ success, "msg": "The url is incorrect" })
    }
    else {
      try {
        const sid = url.split('/r/')[1];
        //getting the meta data
        const response = await fetch(`https://ssr.resume.tools/meta/ssid-${sid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const json = await response.json();
        let pages = json.pages.length;
        let images = [];
        // Download the images and wait for all promises to resolve
        const downloadPromises = [];
        for (let i = 1; i <= pages; i++) {
          const fileName = `./images/${sid}-${i}.png`;
          const url = `https://ssr.resume.tools/to-image/ssid-${sid}-${i}.png?size=2000`;
          downloadPromises.push(downloadImage(url, fileName));
          images.push(fileName);
        }
        await Promise.all(downloadPromises);

        // Combine the images into a PDF and delete the images afterwards

        makePDF(images, sid).then(() => {
          images.forEach(imagePath => {
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Deleted ${imagePath}`);
              }
            });
          });
          success = true;
          res.status(200).json({ success: true, msg: 'PDF successfully generated ... You are now being redirected', sid });

        }).catch((err) => {
          console.log(err)
          res.status(400).json({ success, "msg": "Some error occured" })
        })

      }
      catch (err) {
        console.log(err)
        res.status(400).json({ success, "msg": "Some error occured" })
      }
    }
  }
  else {
    res.status(400).json({ success: false, msg: "Invalid Request" })
  }
}
