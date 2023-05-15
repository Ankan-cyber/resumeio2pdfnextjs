import Head from 'next/head'
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import GithubButton from './GithubButton';

export default function Home() {

  const [url, setUrl] = useState<string>('');
  let loadingInterval: any;

  const startLoading = () => {
    const loginButton: any = document.getElementById('btn');
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
    const loginButton: any = document.getElementById('btn');
    loginButton.innerHTML = `Generate PDF`;
  }

  const downloadResume = async (e: any) => {
    e.preventDefault();
    startLoading();
    let data: any = {
      url: url
    }
    let res = await fetch('/api/makepdf', {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (res.ok) {
      let parsedres = await res.arrayBuffer();
      const blob = new Blob([parsedres], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else {
      let parsedRes: { success: boolean, msg: string } = await res.json();
      toast.error(parsedRes.msg, {
        theme: "light",
        autoClose: 3000,
        position: "bottom-left",
      })
    }
    stopLoading();
  }

  return (
    <>
      <Head>
        <title>Resume Downloader</title>
        <meta name="description" content="A web application that allows users to download their Resume.io resume in PDF format for free" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="resume.io, download, free, pdf " />
      </Head>
      <GithubButton repo="Ankan-cyber/resumeio2pdfnextjs" />
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
            id="btn"
            onClick={downloadResume}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </>
  )
}
