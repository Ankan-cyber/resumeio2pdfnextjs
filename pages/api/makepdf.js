// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import imgToPDF from 'image-to-pdf';
import request from 'request';
import fetch from 'node-fetch';

function encodePdfBuffer(pdfBuffer) {
  var CHUNK_SIZE = 0x8000; // 32kb
  var index = 0;
  var result = '';
  var length = pdfBuffer.length;

  while (index < length) {
    var chunk = pdfBuffer.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, chunk);
    index += CHUNK_SIZE;
  }

  return btoa(result);
}

const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    request.get(url.toString())
      .on("error", (err) => {
        reject(err);
      })
      .on("response", (response) => {
        const chunks = [];
        response.on("data", (chunk) => {
          chunks.push(chunk);
        });
        response.on("end", () => {
          const imageData = Buffer.concat(chunks);
          resolve(imageData);
        });
      });
  });
}

const makePDF = (images) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfChunks = [];
      imgToPDF(images, imgToPDF.sizes.A4)
        .on('data', (chunk) => pdfChunks.push(chunk))
        .on('end', () => {
          const pdfData = Buffer.concat(pdfChunks);
          resolve(pdfData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

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
        if (response.ok) {
          const json = await response.json();
          let pages = json.pages.length;
          let imageBuffers = [];
          // Download the images and wait for all promises to resolve
          const downloadPromises = [];
          for (let i = 1; i <= pages; i++) {
            const url = `https://ssr.resume.tools/to-image/ssid-${sid}-${i}.png?size=2000`;
            downloadPromises.push(downloadImage(url));
          }
          imageBuffers = await Promise.all(downloadPromises);

          // Combine the images into a PDF and delete the images afterwards
          const pdfBuffer = await makePDF(imageBuffers);

          res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="resume.pdf"'
          });
          res.end(pdfBuffer, 'binary');
        }
        else {
          res.status(400).json({ success, "msg": "This url doesn't exist" })
        }
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
