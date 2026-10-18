export interface EnvironmentTelemetry {
  os: string;
  userAgent: string;
  hardwareConcurrency: number | 'UNKNOWN';
  deviceMemory: number | 'UNKNOWN';
  connection: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  } | 'UNKNOWN';
  storageQuota: number | 'UNKNOWN';
  storageUsage: number | 'UNKNOWN';
  batteryLevel: number | 'UNSUPPORTED';
  batteryCharging: boolean | 'UNSUPPORTED';
  windowInnerWidth: number;
  windowInnerHeight: number;
  isTouchDevice: boolean;
}

export class EnvironmentDiscoveryEngine {
  public static async discover(): Promise<EnvironmentTelemetry> {
    const nav = navigator as any;

    let storageQuota: number | 'UNKNOWN' = 'UNKNOWN';
    let storageUsage: number | 'UNKNOWN' = 'UNKNOWN';
    if (nav.storage && nav.storage.estimate) {
      try {
        const estimate = await nav.storage.estimate();
        storageQuota = estimate.quota || 'UNKNOWN';
        storageUsage = estimate.usage || 'UNKNOWN';
      } catch (e) {
        // Ignored
      }
    }

    let batteryLevel: number | 'UNSUPPORTED' = 'UNSUPPORTED';
    let batteryCharging: boolean | 'UNSUPPORTED' = 'UNSUPPORTED';
    if (nav.getBattery) {
      try {
        const battery = await nav.getBattery();
        batteryLevel = battery.level;
        batteryCharging = battery.charging;
      } catch (e) {
        // Ignored
      }
    }

    let connectionInfo: EnvironmentTelemetry['connection'] = 'UNKNOWN';
    if (nav.connection) {
      connectionInfo = {
        effectiveType: nav.connection.effectiveType,
        downlink: nav.connection.downlink,
        rtt: nav.connection.rtt,
        saveData: nav.connection.saveData,
      };
    }

    return {
      os: this.detectOS(),
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || 'UNKNOWN',
      deviceMemory: nav.deviceMemory || 'UNKNOWN',
      connection: connectionInfo,
      storageQuota,
      storageUsage,
      batteryLevel,
      batteryCharging,
      windowInnerWidth: window.innerWidth,
      windowInnerHeight: window.innerHeight,
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };
  }

  private static detectOS(): string {
    const userAgent = window.navigator.userAgent;
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    if (/Windows NT/.test(userAgent)) return 'Windows';
    if (/Mac OS X/.test(userAgent)) return 'macOS';
    if (/Linux/.test(userAgent)) return 'Linux';
    return 'Unknown OS';
  }
}
