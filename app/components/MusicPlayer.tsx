"use client";

import React, { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
  // put your backing track at public/backtrack.m4a
  // (save the file as `public/backtrack.m4a` in the repo)
  const audio = new Audio("/backtrack.m4a");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — wait for first user gesture
        const onFirstGesture = async () => {
          try {
            await audio.play();
            setPlaying(true);
          } catch {
            // still blocked; user must press play
          } finally {
            window.removeEventListener("pointerdown", onFirstGesture);
            window.removeEventListener("touchstart", onFirstGesture);
            window.removeEventListener("keydown", onFirstGesture);
          }
        };

        window.addEventListener("pointerdown", onFirstGesture, { once: true });
        window.addEventListener("touchstart", onFirstGesture, { once: true });
        window.addEventListener("keydown", onFirstGesture, { once: true });
      }
    };

    tryPlay();

    return () => {
      audio.pause();
      audio.src = ""; // release
      audioRef.current = null;
    };
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
  } catch {
        // still blocked; user gesture required
      }
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <div style={{ position: "fixed", right: 12, bottom: 12, zIndex: 9999 }}>
      <button onClick={togglePlay} aria-pressed={playing} style={{ marginRight: 8 }}>
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={toggleMute} aria-pressed={muted}>
        {muted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}
