import React, { useState } from 'react';
import jsPDF from 'jspdf';

function App() {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reURL = /^https:\/\/resume[.]io\/r\/([\w]+)/;
    const isValidURL = reURL.test(url);
    //matching the url
    if (!isValidURL) {
      console.log("The url is incorrect")
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
        for (let i = 1; i <= pages; i++) {
          const imgData = await fetch(`https://ssr.resume.tools/to-image/ssid-${sid}-${i}.png?size=2000`)
            .then(res => res.blob())
            .then(blob => URL.createObjectURL(blob));
          images.push(imgData)
        }
        // Combine the images into a PDF ans send them to client
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        for (let i = 0; i < pages; i++) {
          pdf.addImage(images[i], 'PNG', 0, 0, width, height);
          if (i < pages - 1) {
            pdf.addPage()
          }
        }
        pdf.save("resume.pdf");
      }
      catch (err) {
        console.log("some error occured")
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Resume Downloader</h1>
      <input
        type="text"
        placeholder="Enter resume.io URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "500px", height: "40px", fontSize: "20px" }}
      />
      <br />
      <br />
      <button
        style={{
          width: "150px",
          height: "50px",
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "20px",
          cursor: "pointer"
        }}
        onClick={handleSubmit}
      >
        Generate PDF
      </button>
    </div>
  );
}

export default App;
