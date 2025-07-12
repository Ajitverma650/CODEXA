import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize, ChevronLeft } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowTitle(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Event listeners for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerContainerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.volume = volume;
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [volume]);

  // Hide title after 3 seconds of playback
  useEffect(() => {
    let timeout;
    if (isPlaying && showTitle) {
      timeout = setTimeout(() => setShowTitle(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showTitle]);

  return (
    <div 
      ref={playerContainerRef}
      className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full aspect-video bg-black cursor-pointer"
      />
      
      {/* Title Overlay */}
      {showTitle && (
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent text-white">
          <div className="flex items-center gap-3">
            <ChevronLeft className="text-white" />
            <h2 className="text-2xl font-bold">Editorial Solution</h2>
          </div>
          <p className="ml-8 text-primary">Watch the optimal approach explained</p>
        </div>
      )}
      
      {/* Play Button Overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center w-full h-full group"
          aria-label="Play"
        >
          <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all">
            <Play className="w-16 h-16 text-white/90 group-hover:text-white" />
          </div>
        </button>
      )}
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all duration-300 ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center w-full mb-3">
          <span className="text-white text-xs w-12 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="range range-primary range-xs flex-1 mx-2"
          />
          <span className="text-white text-xs w-12">
            {formatTime(duration)}
          </span>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayPause}
              className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/10"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/10"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </button>
            
            {/* Volume Slider */}
            <div className="flex items-center w-24">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="range range-xs range-primary"
              />
            </div>
          </div>
          
          <div>
            <button
              onClick={toggleFullscreen}
              className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/10"
              aria-label="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Watermark */}
      {isPlaying && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Codexa 
        </div>
      )}
    </div>
  );
};

export default Editorial;