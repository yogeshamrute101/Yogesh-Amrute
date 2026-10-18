export type DiagnosticStatus = 'PASS' | 'BLOCKED' | 'FAIL' | 'NOT_TESTED';
export type RepairStatus = 'REPAIRED' | 'FAILED' | 'REQUIRES_USER_ACTION';

export interface DiagnosticIssue {
  id: string;
  category: 'STORAGE_CORRUPTION' | 'MISSING_ENV' | 'NETWORK_ERROR' | 'UNKNOWN';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  isRepairable: boolean;
}

export interface DiagnosticReport {
  timestamp: number;
  status: DiagnosticStatus;
  issues: DiagnosticIssue[];
}

export interface RepairResult {
  issueId: string;
  status: RepairStatus;
  message: string;
}

export class DiagnosticEngine {
  /**
   * Run all diagnostic checks autonomously
   */
  public static async runDiagnostics(): Promise<DiagnosticReport> {
    const issues: DiagnosticIssue[] = [];

    // Check 1: Storage Corruption Check
    const storageIssue = this.checkLocalStorageCorruption();
    if (storageIssue) {
      issues.push(storageIssue);
    }

    // Check 2: API Reachability / Env check
    const backendIssue = await this.checkBackendHealth();
    if (backendIssue) {
      issues.push(backendIssue);
    }

    return {
      timestamp: Date.now(),
      status: issues.length > 0 ? 'FAIL' : 'PASS',
      issues,
    };
  }

  /**
   * Attempt to autonomously repair an issue
   */
  public static async attemptRepair(issue: DiagnosticIssue): Promise<RepairResult> {
    if (!issue.isRepairable) {
      return {
        issueId: issue.id,
        status: 'REQUIRES_USER_ACTION',
        message: 'Issue cannot be repaired autonomously.',
      };
    }

    try {
      if (issue.category === 'STORAGE_CORRUPTION') {
        // Safe clear of specifically corrupted local storage keys
        localStorage.removeItem('vidoai_studio_project');
        localStorage.removeItem('vidoai_saved_projects_v2');
        return {
          issueId: issue.id,
          status: 'REPAIRED',
          message: 'Cleared corrupted local storage caches successfully.',
        };
      }

      return {
        issueId: issue.id,
        status: 'FAILED',
        message: 'No repair strategy defined for this category.',
      };
    } catch (e: any) {
       return {
        issueId: issue.id,
        status: 'FAILED',
        message: `Repair failed: ${e.message}`,
      };
    }
  }

  private static checkLocalStorageCorruption(): DiagnosticIssue | null {
    try {
      const saved = localStorage.getItem('vidoai_studio_project');
      if (saved) {
        // Just parsing it ensures it's not totally malformed JSON
        JSON.parse(saved);
      }
      return null;
    } catch (e) {
      return {
        id: `err_storage_${Date.now()}`,
        category: 'STORAGE_CORRUPTION',
        severity: 'HIGH',
        message: 'Local storage project data is malformed and may crash the application.',
        isRepairable: true,
      };
    }
  }

  private static async checkBackendHealth(): Promise<DiagnosticIssue | null> {
    try {
      const res = await fetch('/api/system/diagnostics', { method: 'GET' });
      const data = await res.json();
      if (!res.ok || data.status === 'FAIL') {
        return {
          id: `err_backend_${Date.now()}`,
          category: 'MISSING_ENV',
          severity: 'HIGH',
          message: data.error || 'Backend diagnostics reported a failure or missing configuration.',
          isRepairable: false,
        };
      }
      return null;
    } catch (e) {
      return {
         id: `err_network_${Date.now()}`,
         category: 'NETWORK_ERROR',
         severity: 'HIGH',
         message: 'Unable to reach backend diagnostic API. Check network connection.',
         isRepairable: false,
      };
    }
  }
}
