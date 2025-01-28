import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface CustomVideoPlayerProps {
  mediaFilesLength: number;
  fileIndex: number;
  fileUrl: string;
}

export const CustomVideoPlayer = ({
  mediaFilesLength,
  fileIndex,
  fileUrl,
}: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // set the playing state based on visibility
        setIsPlaying(entry.isIntersecting);
      },
      { threshold: 0.8 } // trigger when 70% of the element is in view
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  // For custom controller
  // const playerRef = useRef<ReactPlayer | null>(null);
  // const [played, setPlayed] = useState(0);
  // const [volume, setVolume] = useState(0.8);
  // const handlePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };

  // const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const seekTo = parseFloat(e.target.value);
  //   setPlayed(seekTo);
  //   playerRef.current?.seekTo(seekTo, "fraction");
  // };

  // const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const volumeLevel = parseFloat(e.target.value);
  //   setVolume(volumeLevel);
  // };

  return (
    <div
      ref={videoRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full h-[calc(100%)] bg-black cursor-pointer",
        fileIndex === 0 && "min-h-[453px]",
        fileIndex === 2 && mediaFilesLength > 3 && "brightness-50"
      )}
    >
      <ReactPlayer
        playing={isPlaying && !(fileIndex === 2 && mediaFilesLength > 3)}
        muted
        loop
        controls={
          (!isPlaying || isHovered) &&
          !(fileIndex === 2 && mediaFilesLength > 3)
        }
        url={fileUrl}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
      />

      {/* For custom controller

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between space-x-4 bg-black/75 p-2 rounded-lg">

        <button
          onClick={handlePlayPause}
          className="text-white px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>


        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={played}
          onChange={handleSeek}
          className="flex-grow"
        />


        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24"
        />
      </div> */}
    </div>
  );
};
