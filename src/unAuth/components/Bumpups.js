import React, { useMemo, useState } from "react";
import "./Bumpups.css";
import heroImage from "../../assets/bumpups-hero.jpg";

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})([&?].*)?$/i;

function Bumpups() {
  const [videoUrl, setVideoUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);

  const youtubeApiKey = useMemo(() => process.env.REACT_APP_YOUTUBE_API_KEY?.trim(), []);

  const clearPreviewState = () => {
    setFetchError("");
    setVideoDetails(null);
    setIsLoading(false);
  };

  const extractVideoId = (url) => {
    const match = url.match(YOUTUBE_URL_REGEX);
    return match ? match[4] : null;
  };

  const getPreferredThumbnail = (thumbnails = {}) => {
    const preferredOrder = ["maxres", "standard", "high", "medium", "default"];
    for (const key of preferredOrder) {
      if (thumbnails[key]?.url) {
        return thumbnails[key].url;
      }
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedUrl = videoUrl.trim();

    if (YOUTUBE_URL_REGEX.test(trimmedUrl)) {
      setFormError("");
    } else {
      setFormError("Please paste a valid YouTube video link (e.g. https://youtu.be/VIDEOID).");
      clearPreviewState();
      return;
    }

    if (!youtubeApiKey) {
      setFetchError("Missing YouTube API key. Please set REACT_APP_YOUTUBE_API_KEY in your environment.");
      setVideoDetails(null);
      return;
    }

    const videoId = extractVideoId(trimmedUrl);
    if (!videoId) {
      setFetchError("We could not extract a video from that link. Please try another URL.");
      setVideoDetails(null);
      return;
    }

    setIsLoading(true);
    setFetchError("");
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API responded with status ${response.status}`);
      }

      const payload = await response.json();
      const [item] = payload.items || [];

      if (!item) {
        setFetchError("We couldn't find any details for that video. Double-check the link and try again.");
        setVideoDetails(null);
        return;
      }

      const thumbnailUrl = getPreferredThumbnail(item.snippet?.thumbnails);
      setVideoDetails({
        title: item.snippet?.title ?? "Untitled video",
        channel: item.snippet?.channelTitle ?? "",
        publishedAt: item.snippet?.publishedAt ?? "",
        thumbnailUrl,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      });
    } catch (error) {
      setFetchError("Something went wrong. Please try again in a moment.");
      setVideoDetails(null);
      console.error("Failed to fetch YouTube details:", error);
    } finally {
      setIsLoading(false);
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

        <div className="bumpups-search-wrapper">
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
          {formError && <p className="bumpups-search__error">{formError}</p>}
          {(isLoading || fetchError || videoDetails) && (
            <div className="bumpups-preview" aria-live="polite">
              {isLoading && <p className="bumpups-preview__status">Fetching video details...</p>}
              {!isLoading && fetchError && <p className="bumpups-preview__status bumpups-preview__status--error">{fetchError}</p>}
              {!isLoading && !fetchError && videoDetails && (
                <>
                  {videoDetails.thumbnailUrl ? (
                    <a
                      href={videoDetails.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bumpups-preview__thumbnail"
                    >
                      <img src={videoDetails.thumbnailUrl} alt={`Thumbnail for ${videoDetails.title}`} />
                    </a>
                  ) : (
                    <div className="bumpups-preview__thumbnail bumpups-preview__thumbnail--placeholder">
                      <span>No thumbnail available</span>
                    </div>
                  )}
                  <div className="bumpups-preview__meta">
                    <p className="bumpups-preview__eyebrow">Video detected</p>
                    <h3>{videoDetails.title}</h3>
                    {videoDetails.channel && <p className="bumpups-preview__channel">{videoDetails.channel}</p>}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Bumpups;
