// Simulated WebSocket for real-time provisioning updates
// In production, this would connect to a real WebSocket server

export interface ProvisioningUpdate {
  taskId: string;
  status: "completed" | "in-progress" | "pending" | "failed";
  progress: number;
  message: string;
  timestamp: string;
}

export type ProvisioningCallback = (update: ProvisioningUpdate) => void;

class ProvisioningWebSocket {
  private callbacks: Set<ProvisioningCallback> = new Set();
  private interval: number | null = null;
  private taskProgress: Map<string, number> = new Map();

  connect(tenantId: string) {
    console.log(`[WebSocket] Connecting to provisioning updates for tenant ${tenantId}`);
    
    // Initialize task progress
    ["1", "2", "3", "4", "5"].forEach(id => {
      this.taskProgress.set(id, 0);
    });

    // Simulate real-time updates every 3 seconds
    this.interval = window.setInterval(() => {
      this.simulateUpdate();
    }, 3000);

    // Send initial connection message
    this.broadcast({
      taskId: "system",
      status: "in-progress",
      progress: 0,
      message: "Connected to provisioning updates",
      timestamp: new Date().toISOString(),
    });
  }

  private simulateUpdate() {
    // Randomly pick a task that's not complete yet
    const incompleteTasks = Array.from(this.taskProgress.entries())
      .filter(([_, progress]) => progress < 100);

    if (incompleteTasks.length === 0) {
      console.log("[WebSocket] All tasks complete");
      this.disconnect();
      return;
    }

    const [taskId, currentProgress] = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
    const progressIncrement = Math.floor(Math.random() * 20) + 10; // 10-30% increment
    const newProgress = Math.min(100, currentProgress + progressIncrement);
    
    this.taskProgress.set(taskId, newProgress);

    const statusMap: { [key: string]: "completed" | "in-progress" | "pending" } = {
      "1": "completed",
      "2": "completed",
      "3": "in-progress",
      "4": "pending",
      "5": "pending",
    };

    const taskNames: { [key: string]: string } = {
      "1": "Infrastructure Planning",
      "2": "Network Configuration",
      "3": "Security Hardening",
      "4": "Integration Setup",
      "5": "Final Validation",
    };

    let status: "completed" | "in-progress" | "pending" | "failed" = statusMap[taskId] || "pending";
    let message = `${taskNames[taskId]}: ${newProgress}% complete`;

    if (newProgress === 100) {
      status = "completed";
      message = `${taskNames[taskId]}: Completed successfully`;
    } else if (newProgress > 0) {
      status = "in-progress";
    }

    this.broadcast({
      taskId,
      status,
      progress: newProgress,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private broadcast(update: ProvisioningUpdate) {
    console.log(`[WebSocket] Broadcasting update:`, update);
    this.callbacks.forEach(callback => callback(update));
  }

  subscribe(callback: ProvisioningCallback) {
    this.callbacks.add(callback);
    console.log(`[WebSocket] Subscriber added. Total subscribers: ${this.callbacks.size}`);
  }

  unsubscribe(callback: ProvisioningCallback) {
    this.callbacks.delete(callback);
    console.log(`[WebSocket] Subscriber removed. Total subscribers: ${this.callbacks.size}`);
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.callbacks.clear();
    this.taskProgress.clear();
    console.log("[WebSocket] Disconnected from provisioning updates");
  }
}

// Singleton instance
let wsInstance: ProvisioningWebSocket | null = null;

export const getProvisioningWebSocket = (): ProvisioningWebSocket => {
  if (!wsInstance) {
    wsInstance = new ProvisioningWebSocket();
  }
  return wsInstance;
};
