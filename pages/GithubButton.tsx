/* eslint-disable @next/next/no-img-element */
interface MyComponentProps {
    repo: string;
}

function GithubButton(props: MyComponentProps) {
    const { repo } = props;
    const url = `https://github.com/${repo}`;

    return (
        <div style={{ textAlign: "right" }}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={`https://img.shields.io/github/stars/${repo}?style=social`} alt="GitHub stars" width="100px" height="auto" />
            </a>
            <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={`https://img.shields.io/github/watchers/${repo}?style=social`} alt="GitHub stars" width="100px" height="auto" />
            </a>
            <a href="https://buymeacoffee.com/ankanroy2" target="_blank" rel="noopener noreferrer">
                <img src={`/buymeacoffee.svg`} alt="Buy me a coffee" width="100px" height="auto" />
            </a>
        </div>
    );
}

export default GithubButton;