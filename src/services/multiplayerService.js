/** Future multiplayer architecture placeholder */
export class MultiplayerManager {
  constructor() {
    this.connected = false
    this.players = new Map()
    this.socket = null
  }

  /** Connect to multiplayer server (future) */
  async connect(serverUrl) {
    return { status: 'placeholder', message: 'Multiplayer coming in future update', serverUrl }
  }

  /** Disconnect from server */
  disconnect() {
    this.connected = false
    this.players.clear()
  }

  /** Broadcast player position to other players */
  syncPosition(position, rotation) {
    if (!this.connected) return
    // Future: WebSocket emit
  }

  /** Receive other players' positions */
  onPlayerUpdate(callback) {
    // Future: WebSocket listener
    return () => {}
  }

  /** Get all connected players */
  getPlayers() {
    return Array.from(this.players.values())
  }
}

export const multiplayerManager = new MultiplayerManager()
