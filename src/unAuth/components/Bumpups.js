import React, { useState } from "react";
import "./Bumpups.css";
import heroImage from "../../assets/bumpups-hero.jpg";

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})([&?].*)?$/i;

function Bumpups() {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedUrl = videoUrl.trim();

    if (YOUTUBE_URL_REGEX.test(trimmedUrl)) {
      setError("");
      console.info("YouTube URL accepted:", trimmedUrl);
    } else {
      setError("Please paste a valid YouTube video link (e.g. https://youtu.be/VIDEOID).");
    }
  };

  return (
    <section className="bumpups">
      <div
        className="bumpups-hero"
        style={{
          backgroundImage: `linear-gradient(200deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.55) 100%), url(${heroImage})`,
        }}
      >
        <div className="bumpups-hero__content">
          <h1>Lorem ipsum dolor sit amet consectetur.</h1>
          <h2>Morbi tristique senectus et netus et malesuada fames ac turpis egestas.</h2>
        </div>

        <form className="bumpups-search" role="search" onSubmit={handleSubmit}>
          <label htmlFor="bumpups-search-input" className="sr-only">
            Paste a YouTube video URL
          </label>
          <input
            id="bumpups-search-input"
            type="url"
            inputMode="url"
            placeholder="Paste a YouTube video link"
            aria-label="Paste a YouTube video link"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            pattern={YOUTUBE_URL_REGEX.source}
            title="Enter a YouTube URL such as https://youtu.be/VIDEOID"
            required
          />
          <button type="submit">Analyze</button>
        </form>
        {error && <p className="bumpups-search__error">{error}</p>}
      </div>
    </section>
  );
}

export default Bumpups;
