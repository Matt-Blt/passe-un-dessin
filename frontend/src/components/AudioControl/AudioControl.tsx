import React, { useRef, useEffect, useState } from 'react';
import { AudioControlButton } from './AudioControl.style';
import soundOn from 'assets/sound-on.svg';
import soundOff from 'assets/sound-off.svg';

const AudioControl: React.FC = () => {
  const audioElt = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioElt.current) return;
    const currentElt = audioElt.current;

    const playingListener = () => setPlaying(true);
    currentElt.addEventListener('play', playingListener);

    const pausedListener = () => setPlaying(false);
    currentElt.addEventListener('pause', pausedListener);

    return () => {
      currentElt.removeEventListener('play', playingListener);
      currentElt.removeEventListener('pause', pausedListener);
    };
  }, [audioElt]);

  const play = () => {
    audioElt.current?.play();
    localStorage.removeItem('noSound');
  };

  const pause = () => {
    audioElt.current?.pause();
    localStorage.setItem('noSound', 'true');
  };

  useEffect(() => {
    if (audioElt.current && !localStorage.getItem('noSound')) {
      audioElt.current
        .play()
        .then(() => setPlaying(true))
        .catch(err => {
          console.log(err);
          setPlaying(false);
        });
    }
  }, [audioElt]);

  return (
    <>
      <audio loop ref={audioElt}>
        <source src="/JeffSpeed68-Ultra-Lights.mp3" />
        Your browser does not support the audio element.
      </audio>
      {playing ? (
        <AudioControlButton onClick={pause}>
          <img src={soundOn} alt="Sound is on; click to turn off" />
        </AudioControlButton>
      ) : (
        <AudioControlButton onClick={play}>
          <img src={soundOff} alt="Sound is off; click to turn on" />
        </AudioControlButton>
      )}
    </>
  );
};

export default AudioControl;
