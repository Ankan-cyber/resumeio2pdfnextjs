import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [url, setUrl] = useState('');
  let loadingInterval;

  const startLoading = () => {
    const loginButton = document.getElementById('btn');
    let dots = 0;
    loadingInterval = setInterval(() => {
      if (dots >= 5) {
        dots = 0;
      }
      loginButton.innerHTML = `${'.'.repeat(dots)}`;
      dots++;
    }, 500);
  };

  const stopLoading = () => {
    clearInterval(loadingInterval);
    const loginButton = document.getElementById('btn');
    loginButton.innerHTML = `Generate PDF`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    const reURL = /^https:\/\/resume[.]io\/r\/([\w]+)/;
    const isValidURL = reURL.test(url);
    //matching the url
    if (!isValidURL) {
      stopLoading()
      toast.error("URl Is Incorrect", {
        position: "top-center",
        theme: "colored",
        autoClose: 3000
      })
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
          images.push(`https://ssr.resume.tools/to-image/ssid-${sid}-${i}.png?size=2000`)
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
        stopLoading();
      }
      catch (err) {
        stopLoading();
        console.log(err)
        toast.error("Some Error Occured", {
          position: "top-center",
          theme: "colored",
          autoClose: 3000
        })
      }
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Download Resume.io resume in pdf for FREE</h1>
      <div id="container">
        <div id="box">
          <h1>Resume Downloader</h1>
          <input
            type="text"
            placeholder="Enter resume.io URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <br />
          <br />
          <button
            style={{
              width: "170px",
              height: "40px",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              border: "none",
              borderRadius: "10px"
            }}
            onClick={handleSubmit}
            id="btn"
          >
            Generate PDF
          </button>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default App;
