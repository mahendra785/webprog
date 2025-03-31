// Types for WebSocket messages
export type PartyWatchMessage = 
  | { type: 'JOIN_PARTY'; partyId: string; username: string }
  | { type: 'CREATE_PARTY'; username: string }
  | { type: 'PARTY_JOINED'; partyId: string; members: string[]; isHost: boolean }
  | { type: 'MEMBER_JOINED'; username: string }
  | { type: 'MEMBER_LEFT'; username: string }
  | { type: 'PLAY'; timestamp: number }
  | { type: 'PAUSE'; timestamp: number }
  | { type: 'SEEK'; position: number }
  | { type: 'PLAYBACK_RATE'; rate: number }
  | { type: 'ERROR'; message: string };

export interface PartyWatchState {
  connected: boolean;
  partyId: string | null;
  members: string[];
  isHost: boolean;
  error: string | null;
}

// For demo purposes, we'll simulate a WebSocket server
// In a real app, this would connect to an actual WebSocket server
export class PartyWatchService {
  private ws: WebSocket | null = null;
  private state: PartyWatchState = {
    connected: false,
    partyId: null,
    members: [],
    isHost: false,
    error: null
  };
  private listeners: ((state: PartyWatchState) => void)[] = [];
  private messageHandlers: ((message: PartyWatchMessage) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private simulatedParties: Record<string, { host: string; members: string[] }> = {};

  constructor(private username: string = `User_${Math.floor(Math.random() * 10000)}`) {}

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve) => {
      // In a real app, connect to an actual WebSocket server
      // For demo, we'll simulate a WebSocket connection
      setTimeout(() => {
        this.state.connected = true;
        this.updateState();
        resolve();
      }, 500);
    });
  }

  // Create a new watch party
  createParty(): Promise<string> {
    return new Promise((resolve) => {
      // Generate a random party ID
      const partyId = Math.random().toString(36).substring(2, 10);
      
      // Simulate server creating a party
      this.simulatedParties[partyId] = {
        host: this.username,
        members: [this.username]
      };
      
      // Update local state
      this.state.partyId = partyId;
      this.state.members = [this.username];
      this.state.isHost = true;
      this.updateState();
      
      // Notify message handlers
      this.notifyMessageHandlers({
        type: 'PARTY_JOINED',
        partyId,
        members: [this.username],
        isHost: true
      });
      
      resolve(partyId);
    });
  }

  // Join an existing watch party
  joinParty(partyId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if party exists in our simulation
      if (this.simulatedParties[partyId]) {
        // Add member to party
        this.simulatedParties[partyId].members.push(this.username);
        
        // Update local state
        this.state.partyId = partyId;
        this.state.members = [...this.simulatedParties[partyId].members];
        this.state.isHost = false;
        this.updateState();
        
        // Notify message handlers
        this.notifyMessageHandlers({
          type: 'PARTY_JOINED',
          partyId,
          members: this.state.members,
          isHost: false
        });
        
        // Notify other members (in a real app, this would be done by the server)
        this.notifyMessageHandlers({
          type: 'MEMBER_JOINED',
          username: this.username
        });
        
        resolve();
      } else {
        // Party doesn't exist
        this.state.error = "Party not found";
        this.updateState();
        reject(new Error("Party not found"));
      }
    });
  }

  // Leave the current party
  leaveParty(): void {
    if (this.state.partyId && this.simulatedParties[this.state.partyId]) {
      const partyId = this.state.partyId;
      
      // Remove member from party
      this.simulatedParties[partyId].members = 
        this.simulatedParties[partyId].members.filter(m => m !== this.username);
      
      // If party is empty, remove it
      if (this.simulatedParties[partyId].members.length === 0) {
        delete this.simulatedParties[partyId];
      }
      // If host left, assign new host
      else if (this.simulatedParties[partyId].host === this.username) {
        this.simulatedParties[partyId].host = this.simulatedParties[partyId].members[0];
      }
      
      // Notify other members (in a real app, this would be done by the server)
      this.notifyMessageHandlers({
        type: 'MEMBER_LEFT',
        username: this.username
      });
    }
    
    // Reset local state
    this.state.partyId = null;
    this.state.members = [];
    this.state.isHost = false;
    this.updateState();
  }

  // Send a message to the party
  sendMessage(message: PartyWatchMessage): void {
    if (!this.state.connected || !this.state.partyId) {
      console.error("Not connected to a party");
      return;
    }
    
    // In a real app, send the message to the WebSocket server
    // For demo, we'll just notify our message handlers directly
    this.notifyMessageHandlers(message);
  }

  // Subscribe to state changes
  subscribe(listener: (state: PartyWatchState) => void): () => void {
    this.listeners.push(listener);
    // Immediately notify with current state
    listener(this.state);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Subscribe to incoming messages
  onMessage(handler: (message: PartyWatchMessage) => void): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  // Get current state
  getState(): PartyWatchState {
    return { ...this.state };
  }

  // Update state and notify listeners
  private updateState(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  // Notify message handlers
  private notifyMessageHandlers(message: PartyWatchMessage): void {
    this.messageHandlers.forEach(handler => handler(message));
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.state.partyId) {
      this.leaveParty();
    }
    
    this.state.connected = false;
    this.updateState();
  }

  // Set username
  setUsername(username: string): void {
    this.username = username;
  }

  // Get username
  getUsername(): string {
    return this.username;
  }
}
