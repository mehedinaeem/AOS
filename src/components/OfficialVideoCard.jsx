import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, BadgeCheck } from "lucide-react";
import { formatDuration, formatViews } from "../data/videos";
export default function OfficialVideoCard({ video }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link className="card official-video-card" to={`/videos/${video.id}`}>
      <div className="official-thumbnail">
        {!failed ? (
          <img
            src={video.thumbnail}
            alt={`Video thumbnail: ${video.title}`}
            width="480"
            height="360"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="thumbnail-fallback">
            <Play size={32} />
            <span>Thumbnail unavailable</span>
          </span>
        )}
        {formatDuration(video.durationSeconds) && (
          <span className="video-duration">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
      </div>
      <div className="official-video-copy">
        <span className="official-badge">
          <BadgeCheck size={15} />
          Official channel
        </span>
        <h3>{video.title}</h3>
        <p className="video-category">{video.category}</p>
        <p className="video-views">
          {formatViews(video.viewCount)}
          {video.viewCount !== null && <span> · dataset snapshot</span>}
        </p>
      </div>
    </Link>
  );
}
