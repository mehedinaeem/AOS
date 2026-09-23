import { useState } from "react";
import { videoId, playlistId } from "../utils/youtube";
import { EmptyState } from "./ui";
export function YouTubePlayer({ video, playlist, title }) {
  const [failed, setFailed] = useState(false);
  const id = video ? videoId(video) : playlistId(playlist);
  if (!id)
    return (
      <EmptyState
        title="This video is not available yet"
        description="A valid YouTube link has not been added."
      />
    );
  const source = video
    ? `https://www.youtube.com/watch?v=${id}`
    : `https://www.youtube.com/playlist?list=${id}`;
  return (
    <div>
      {!failed ? (
        <iframe
          className="video-player"
          src={
            video
              ? `https://www.youtube-nocookie.com/embed/${id}`
              : `https://www.youtube-nocookie.com/embed/videoseries?list=${id}`
          }
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setFailed(true)}
        />
      ) : (
        <EmptyState title="The player could not load" />
      )}
      <p className="player-note">
        If this video is unavailable, age-restricted, or cannot be embedded,{" "}
        <a href={source} target="_blank" rel="noreferrer">
          open on YouTube ↗
        </a>
        .
      </p>
    </div>
  );
}
