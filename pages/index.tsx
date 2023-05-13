import Head from 'next/head'
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function Home() {


  const router = useRouter();
  const [url, setUrl] = useState<string>('');

  const downloadResume = async (e: any) => {
    e.preventDefault();
    let data: any = {
      url: url
    }
    let res = await fetch('/api/makepdf', {
      method: "POST",
      body: JSON.stringify(data),
    })
    let parsedres: { success: boolean, msg: string, sid?: string } = await res.json();
    if (parsedres.success) {
      toast.success(parsedres.msg, {
        theme: "light",
        autoClose: 5000,
        position: "bottom-left",
      })
      setTimeout(() => {
        router.push(`/api/download?sid=${parsedres.sid}`);
      }, 1000)
    }
    else {
      toast.error(parsedres.msg, {
        theme: "light",
        autoClose: 3000,
        position: "bottom-left",
      })
    }
  }
  return (
    <>
      <Head>
        <title>Resume Downloader</title>
        <meta name="description" content="A web application that allows users to download their Resume.io resume in PDF format for free" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
      <ToastContainer />
    </>
  )
}
