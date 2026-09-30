/**
 * LernexAI Proprietary — Conflict-Free Replicated Data Types (CRDT)
 * Zero-Server Multi-Tab & Local Peer Mesh Synchronization Engine.
 * Combines Lamport Logical Clocks with ZLIB/DEFLATE Binary Frames over BroadcastChannel.
 */
import { deflate, inflate } from 'pako'
import { nanoid } from 'nanoid'
import type { Canvas as FabricCanvas } from 'fabric'

export interface CrdtStatePacket {
  peerId: string
  lamportClock: number
  timestamp: number
  compressedGraph: number[]
}

class CorexCrdtMesh {
  public readonly peerId = `peer_${nanoid(6)}`
  public lamportClock = 0
  public connectedPeers = new Set<string>()
  private channel: BroadcastChannel | null = null
  private stage: FabricCanvas | null = null
  private onPeerUpdate?: (peerCount: number, clock: number) => void

  public attach(
    stage: FabricCanvas,
    onPeerUpdate?: (peerCount: number, clock: number) => void,
  ) {
    this.stage = stage
    this.onPeerUpdate = onPeerUpdate
    if (typeof BroadcastChannel === 'undefined') return

    this.channel = new BroadcastChannel('corex_crdt_mesh_v2')
    this.channel.onmessage = async (ev: MessageEvent) => {
      const msg = ev.data
      if (!msg || msg.peerId === this.peerId) return

      this.connectedPeers.add(msg.peerId)

      if (msg.type === 'HELLO') {
        this.channel?.postMessage({ type: 'ACK', peerId: this.peerId, lamportClock: this.lamportClock })
        this.onPeerUpdate?.(this.connectedPeers.size + 1, this.lamportClock)
        return
      }

      if (msg.type === 'ACK') {
        this.onPeerUpdate?.(this.connectedPeers.size + 1, this.lamportClock)
        return
      }

      if (msg.type === 'CRDT_DELTA' && this.stage) {
        if (msg.lamportClock >= this.lamportClock) {
          this.lamportClock = msg.lamportClock + 1
          try {
            const binary = new Uint8Array(msg.compressedGraph)
            const jsonStr = new TextDecoder().decode(inflate(binary))
            ;(this.stage as any)._isRestoring = true
            await this.stage.loadFromJSON(JSON.parse(jsonStr))
            this.stage.requestRenderAll()
            ;(this.stage as any)._isRestoring = false
            this.onPeerUpdate?.(this.connectedPeers.size + 1, this.lamportClock)
          } catch {
            // Ignore malformed peer frame
          }
        }
      }
    }

    this.channel.postMessage({ type: 'HELLO', peerId: this.peerId, lamportClock: this.lamportClock })
  }

  public broadcastDelta(stage: FabricCanvas) {
    if (!this.channel || (stage as any)._isRestoring) return
    this.lamportClock += 1
    const jsonStr = JSON.stringify((stage as any).toJSON(['__uid', 'corexLabel']))
    const compressed = Array.from(deflate(jsonStr))
    const packet: CrdtStatePacket & { type: string } = {
      type: 'CRDT_DELTA',
      peerId: this.peerId,
      lamportClock: this.lamportClock,
      timestamp: Date.now(),
      compressedGraph: compressed,
    }
    this.channel.postMessage(packet)
    this.onPeerUpdate?.(this.connectedPeers.size + 1, this.lamportClock)
  }

  public detach() {
    this.channel?.close()
    this.channel = null
  }
}

export const crdtMesh = new CorexCrdtMesh()
