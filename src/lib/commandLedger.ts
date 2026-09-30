/**
 * LernexAI Proprietary — Binary Transaction Command Ledger
 * Replaces linear plain-text snapshot arrays with ZLIB/DEFLATE (pako)
 * binary-encoded transaction buffers (Uint8Array).
 */
import { deflate, inflate } from 'pako'
import { nanoid } from 'nanoid'

export interface CanvasCommand {
  id: string
  execute(targetLayer: any): void
  undo(targetLayer: any): void
  serialize(): Uint8Array
}

export class MoveElementCommand implements CanvasCommand {
  constructor(
    public id: string,
    private targetId: string,
    private oldCoordinates: { x: number; y: number },
    private newCoordinates: { x: number; y: number },
  ) {}

  execute(targetLayer: any) {
    const node = targetLayer?.getObjects?.()?.find((o: any) => o.__uid === this.targetId)
    if (node) {
      node.set({ left: this.newCoordinates.x, top: this.newCoordinates.y })
      targetLayer.requestRenderAll?.()
    }
  }

  undo(targetLayer: any) {
    const node = targetLayer?.getObjects?.()?.find((o: any) => o.__uid === this.targetId)
    if (node) {
      node.set({ left: this.oldCoordinates.x, top: this.oldCoordinates.y })
      targetLayer.requestRenderAll?.()
    }
  }

  serialize(): Uint8Array {
    const metaString = JSON.stringify({
      t: 'MOV',
      i: this.targetId,
      o: [this.oldCoordinates.x, this.oldCoordinates.y],
      n: [this.newCoordinates.x, this.newCoordinates.y],
    })
    return deflate(metaString)
  }
}

/**
 * Encodes a scene graph state into a compressed binary Uint8Array frame.
 */
export function encodeSceneTransaction(scenePayload: unknown): Uint8Array {
  const raw = typeof scenePayload === 'string' ? scenePayload : JSON.stringify(scenePayload)
  const envelope = JSON.stringify({
    txId: nanoid(10),
    ts: Date.now(),
     graph: raw,
  })
  return deflate(envelope)
}

/**
 * Decodes a compressed binary Uint8Array frame back into a scene graph JSON string.
 */
export function decodeSceneTransaction(binaryPacket: Uint8Array): string {
  const inflatedBytes = inflate(binaryPacket)
  const inflatedText = new TextDecoder().decode(inflatedBytes)
  const parsed = JSON.parse(inflatedText)
  return parsed.graph
}
