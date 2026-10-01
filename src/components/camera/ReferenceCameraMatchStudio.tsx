import React, { useEffect, useRef, useState } from 'react';
import { CameraService } from '../../core/camera/CameraService';
import {
  LiveReferenceFrame,
  ReferenceMatchResult,
  ReferencePhoto,
} from '../../core/camera/match';
import { LiveReferenceMatchController } from '../../core/camera/match';

interface Props {
  reference?: ReferencePhoto | null;
  prompt?: string;
}

export default function ReferenceCameraMatchStudio({
  reference = null,
  prompt = '',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<CameraService | null>(null);
  const controllerRef = useRef(
    new LiveReferenceMatchController()
  );

  const [cameraOn, setCameraOn] = useState(false);
  const [matching, setMatching] = useState(false);
  const [result, setResult] =
    useState<ReferenceMatchResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reference) {
      controllerRef.current.setReference(reference);
    }
  }, [reference]);

  const start = async () => {
    try {
      setError('');

      if (!reference) {
        setError('Please select a reference photo first.');
        return;
      }

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
          : 'Camera could not be started.'
      );
    }
  };

  const stop = () => {
    cameraRef.current?.stop();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  const captureAndMatch = async () => {
    if (!videoRef.current || !reference) {
      setError('Reference photo and camera are required.');
      return;
    }

    setMatching(true);
    setError('');

    try {
      const video = videoRef.current;

      const frame: LiveReferenceFrame = {
        timestamp: Date.now(),
        width: video.videoWidth,
        height: video.videoHeight,
        faceDetected: true,
        subjectDetected: true,
        poseDetected: false,
        brightness: 0.5,
        confidence:
          video.videoWidth > 0 ? 0.75 : 0,
      };

      const next =
        await controllerRef.current.processLiveFrame(
          frame,
          4
        );

      setResult(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Reference matching failed.'
      );
    } finally {
      setMatching(false);
    }
  };

  useEffect(() => {
    return () => cameraRef.current?.stop();
  }, []);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-lg font-semibold">
        Reference → Live Camera Match
      </div>

      <div className="text-sm text-white/60">
        {prompt ||
          'Match the live camera photo to the selected reference.'}
      </div>

      {reference && (
        <div className="rounded-xl border border-white/10 p-3 text-sm">
          Reference selected: {reference.name || reference.id}
        </div>
      )}

      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {!cameraOn ? (
          <button
            type="button"
            onClick={start}
            className="rounded-xl bg-white px-4 py-2 text-black"
          >
            Camera ON
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={captureAndMatch}
              disabled={matching}
              className="rounded-xl bg-white px-4 py-2 text-black disabled:opacity-50"
            >
              {matching
                ? 'Matching...'
                : 'Capture & Auto Match'}
            </button>

            <button
              type="button"
              onClick={stop}
              className="rounded-xl border border-white/20 px-4 py-2"
            >
              Camera OFF
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="font-medium">
            Match Results
          </div>

          <div className="mt-2 text-sm text-white/60">
            {result.message}
          </div>

          <div className="mt-4 grid gap-3">
            {result.candidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="rounded-xl border border-white/10 p-3"
              >
                <div className="flex items-center justify-between">
                  <span>
                    Result {index + 1}
                  </span>

                  <span>
                    {Math.round(
                      candidate.overallScore * 100
                    )}%
                  </span>
                </div>

                <div className="mt-1 text-xs text-white/50">
                  {candidate.verified
                    ? '✓ Verified'
                    : 'Needs review'}
                </div>

                {candidate.outputUri && (
                  <img
                    src={candidate.outputUri}
                    alt={`Reference match result ${index + 1}`}
                    className="mt-3 max-h-72 w-full rounded-lg object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
