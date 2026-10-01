import React, { useEffect, useRef, useState } from 'react';
import {
  CameraService,
  LiveCameraEngine,
  LiveCameraResult,
} from '../../core/camera';

interface Props {
  prompt?: string;
}

export default function LiveCameraStudio({
  prompt = 'cinematic portrait with soft edge and warm mood',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<CameraService | null>(null);
  const engineRef = useRef(new LiveCameraEngine());

  const [cameraOn, setCameraOn] = useState(false);
  const [result, setResult] = useState<LiveCameraResult | null>(null);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      setError('');

      const camera = new CameraService();
      const stream = await camera.start();

      cameraRef.current = camera;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOn(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to start camera.'
      );
    }
  };

  const stopCamera = () => {
    cameraRef.current?.stop();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setResult(null);
  };

  useEffect(() => {
    if (!cameraOn) return;

    const timer = window.setInterval(() => {
      if (!videoRef.current) return;

      const next = engineRef.current.analyzeFrame(
        videoRef.current,
        { prompt }
      );

      setResult(next);
    }, 500);

    return () => window.clearInterval(timer);
  }, [cameraOn, prompt]);

  useEffect(() => {
    return () => cameraRef.current?.stop();
  }, []);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="relative overflow-hidden rounded-xl bg-black aspect-video">
        <video
          ref={videoRef}
          muted
          playsInline
          className="h-full w-full object-cover"
        />

        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60">
            Camera Off
          </div>
        )}

        {cameraOn && result?.verified && (
          <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-white/20" />
        )}
      </div>

      <div className="flex gap-2">
        {!cameraOn ? (
          <button
            type="button"
            onClick={startCamera}
            className="rounded-xl bg-white px-4 py-2 text-black"
          >
            Camera ON
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="rounded-xl border border-white/20 px-4 py-2 text-white"
          >
            Camera OFF
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-white/10 p-3 text-sm">
          <div className="font-medium text-white">
            Live AI Director
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-white/70">
            <span>Background: {result.plan.background}</span>
            <span>Edge: {result.plan.edge}</span>
            <span>Mood: {result.plan.mood}</span>
            <span>Image → Video: {result.plan.imageToVideo ? 'ON' : 'OFF'}</span>
            <span>Confidence: {Math.round(result.plan.confidence * 100)}%</span>
            <span>Verified: {result.verified ? 'YES' : 'NO'}</span>
          </div>

          <div className="mt-3 text-xs text-white/50">
            {result.message}
          </div>
        </div>
      )}
    </div>
  );
}
