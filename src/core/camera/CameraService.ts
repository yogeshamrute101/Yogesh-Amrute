export class CameraService {
  private stream: MediaStream | null = null;

  async start(): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera API is not available on this device.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    return this.stream;
  }

  stop(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }
}
