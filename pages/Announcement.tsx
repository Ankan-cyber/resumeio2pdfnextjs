import React, { useState } from "react";
import Link from "next/link";

function Announcement() {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const hideBanner = () => {
        setIsBannerVisible(false);
    };

    return (
        <>
            {isBannerVisible && (
                <div className="banner">
                    <div className="banner__content">
                        <div className="banner__text">
                            <strong>Info:</strong> Because of some recent changes in resume.io the share link can't be generated. So if you are in this situation{" "}
                            <Link href="https://github.com/ngntriminh/ResumeGrabber" style={{ color: 'white' }}>use this repo to get the chrome extension for downloading resume</Link>
                        </div>
                        <button className="banner__close closebtn" type="button" onClick={hideBanner}>&times;</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Announcement;
