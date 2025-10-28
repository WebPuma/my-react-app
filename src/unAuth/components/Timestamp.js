import React, { useMemo, useState } from "react";
import "./Timestamp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faChartLine,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";

const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})([&?].*)?$/i;

const FEATURES = [
  {
    title: "All your expenses in one place",
    description:
      "Pharetra nunc magna libero sagittis facilisis purus commodo donec dolor. Netus pellentesque.",
    icon: faCoins,
  },
  {
    title: "Transparent spending",
    description:
      "Tincidunt nisi felis elementum commodo id. Imperdiet diam elit cras morbi in.",
    icon: faChartLine,
  },
  {
    title: "Complete privacy and protection",
    description:
      "Phasellus nisi eu nunc quam ipsum interdum placerat varius.",
    icon: faShieldAlt,
  },
];

function Timestamp() {
  const [videoUrl, setVideoUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");

  const youtubeApiKey = useMemo(
    () => process.env.REACT_APP_YOUTUBE_API_KEY?.trim(),
    []
  );

  const extractVideoId = (url) => {
    const match = url.match(YOUTUBE_URL_REGEX);
    return match ? match[4] : null;
  };

  const getPreferredThumbnail = (thumbnails = {}) => {
    const ordered = ["maxres", "standard", "high", "medium", "default"];
    for (const key of ordered) {
      if (thumbnails[key]?.url) {
        return thumbnails[key].url;
      }
    }
    return "";
  };

  const handlePreviewSubmit = async (event) => {
    event.preventDefault();
    const trimmedUrl = videoUrl.trim();

    if (!YOUTUBE_URL_REGEX.test(trimmedUrl)) {
      setPreviewError(
        "Please provide a valid YouTube video link (e.g. https://youtu.be/VIDEOID)."
      );
      setPreview(null);
      return;
    }

    if (!youtubeApiKey) {
      setPreviewError(
        "Missing YouTube API key. Please ensure REACT_APP_YOUTUBE_API_KEY is set."
      );
      setPreview(null);
      return;
    }

    const videoId = extractVideoId(trimmedUrl);
    if (!videoId) {
      setPreviewError("Unable to extract a video from that link. Try another URL.");
      setPreview(null);
      return;
    }

    setPreviewError("");
    setIsPreviewLoading(true);
    setGenerationStatus("");
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
        setPreviewError(
          "We couldn't find details for that video. Double-check the link."
        );
        setPreview(null);
        return;
      }
      setPreview({
        title: item.snippet?.title ?? "Untitled video",
        channel: item.snippet?.channelTitle ?? "",
        thumbnail: getPreferredThumbnail(item.snippet?.thumbnails),
        originalUrl: trimmedUrl,
      });
    } catch (error) {
      console.error("Failed to fetch YouTube preview:", error);
      setPreviewError("Something went wrong while fetching the video. Try again.");
      setPreview(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleGenerateTimestamps = async () => {
    if (!preview?.originalUrl) {
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("");
    try {
      const callable = httpsCallable(functions, "generate_timestamps");
      const result = await callable({ url: preview.originalUrl });
      console.log("generate_timestamps result:", result.data);
      setGenerationStatus("Timestamps generated — check your console output.");
    } catch (error) {
      console.error("generate_timestamps failed:", error);
      setGenerationStatus(
        error.message || "Unable to generate timestamps. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="timestamp">
      <div className="timestamp__inner">
        <div className="timestamp__icon-stack" aria-hidden="true">
          <span className="timestamp__icon-layer timestamp__icon-layer--bottom" />
          <span className="timestamp__icon-layer timestamp__icon-layer--top" />
        </div>
        <h2 className="timestamp__title">
          Pay where you want, when you want, how you want
        </h2>
        <p className="timestamp__subtitle">
          Dolor tellus magna egestas amet. Quisque sed ultrices sagittis
          </p>

        <ul className="timestamp__features">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="timestamp__feature">
              <div className="timestamp__feature-icon" aria-hidden="true">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="timestamp__tool">
        <form className="timestamp__form" onSubmit={handlePreviewSubmit}>
          <label htmlFor="timestamp-video-url" className="sr-only">
            Paste a YouTube video URL
          </label>
          <input
            id="timestamp-video-url"
            type="url"
            inputMode="url"
            placeholder="Paste a YouTube video link"
            aria-label="Paste a YouTube video link"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            required
          />
          <button type="submit" disabled={isPreviewLoading}>
            {isPreviewLoading ? "Loading..." : "Preview Video"}
          </button>
        </form>
        {previewError && <p className="timestamp__error">{previewError}</p>}

        {preview && (
          <div className="timestamp__preview">
            {preview.thumbnail ? (
              <img
                src={preview.thumbnail}
                alt={`Thumbnail for ${preview.title}`}
              />
            ) : (
              <div className="timestamp__preview--placeholder">
                <span>No thumbnail available</span>
              </div>
            )}
            <div className="timestamp__preview-details">
              <p className="timestamp__preview-eyebrow">Video detected</p>
              <h3>{preview.title}</h3>
              {preview.channel && (
                <p className="timestamp__preview-channel">{preview.channel}</p>
              )}
            </div>
          </div>
        )}

        {preview && (
          <div className="timestamp__actions">
            <button
              type="button"
              onClick={handleGenerateTimestamps}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating…" : "Generate Timestamps"}
            </button>
            {generationStatus && (
              <p className="timestamp__status">{generationStatus}</p>
            )}
          </div>
        )}
      </div>

      {/**
       * Previous layout for quick reference:
       * <div className="timestamp">Timestamp Component</div>
       */}
    </section>
  );
}

export default Timestamp;
