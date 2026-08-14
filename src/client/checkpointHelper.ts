import { Config } from '../shared/config';

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Vector4 extends Vector3 {
  heading: number
}

export interface CheckpointData extends Vector3 {
  id: number
  heading?: number
  radius: number
}

export interface CaptureOptions {
  minDistance?: number    // Minimum distance from last point (default: 25.0)
  snapToRoad?: boolean     // Attempt to snap to GTA road network (default: true)
  maxSnapDistance?: number // Max distance allowed for road snapping (default: 8.0)
  defaultRadius?: number  // Radius of checkpoint (default: 6.0)
}

export class CheckpointHelper {
  private static activeMarkerHandle: number | null = null

  /**
   * Fast math-based rounding to 2 decimal places (zero string allocations)
   */
  public static round(val: number): number {
    return Math.round(val * 100) / 100
  }

  /**
   * Fast Euclidean distance between two 3D vectors
   */
  public static getDistance(p1: Vector3, p2: Vector3): number {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const dz = p1.z - p2.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Snaps coordinates to the nearest GTA V road node if within threshold
   */
  public static getRoadSnappedCoords(
    coords: Vector3,
    maxDistance = 8.0
  ): { coords: Vector3; heading: number } | null {
    const [hasNode, nodeCoords, nodeHeading] = GetClosestVehicleNodeWithHeading(
      coords.x,
      coords.y,
      coords.z,
      1,   // Standard vehicle road node
      3.0, // Search threshold
      0
    )

    if (hasNode && nodeCoords) {
      const snapped: Vector3 = {
        x: nodeCoords[0] as number,
        y: nodeCoords[1] as number,
        z: nodeCoords[2] as number,
      }

      if (this.getDistance(coords, snapped) <= maxDistance) {
        return {
          coords: {
            x: this.round(snapped.x),
            y: this.round(snapped.y),
            z: this.round(snapped.z),
          },
          heading: this.round(nodeHeading),
        };
      }
    }
    return null
  }

  /**
   * Captures the driver's current position and validates criteria
   */
  public static tryCaptureCurrentPosition(
    lastCheckpoint: CheckpointData | null,
    nextId: number,
    options: CaptureOptions = {}
  ): CheckpointData | null {
    const {
      minDistance = 25.0,
      snapToRoad = true,
      maxSnapDistance = 8.0,
      defaultRadius = 6.0,
    } = options

    const ped = PlayerPedId()
    const vehicle = GetVehiclePedIsIn(ped, false)

    // Ensure player is the driver
    if (vehicle === 0 || GetPedInVehicleSeat(vehicle, -1) !== ped) {
      return null
    }

    const [vx, vy, vz] = GetEntityCoords(vehicle, true) as number[]
    const rawCoords: Vector3 = { x: vx as number, y: vy as number, z: vz as number }
    const rawHeading = GetEntityHeading(vehicle);

    // Distance threshold check from previous point
    if (lastCheckpoint && this.getDistance(rawCoords, lastCheckpoint) < minDistance) {
      return null
    }

    let finalCoords: Vector3 = {
      x: this.round(rawCoords.x),
      y: this.round(rawCoords.y),
      z: this.round(rawCoords.z),
    };
    let finalHeading = this.round(rawHeading);

    if (snapToRoad) {
      const snapped = this.getRoadSnappedCoords(rawCoords, maxSnapDistance);
      if (snapped) {
        finalCoords = snapped.coords
        finalHeading = snapped.heading
      }
    }

    return {
      id: nextId,
      x: finalCoords.x,
      y: finalCoords.y,
      z: finalCoords.z,
      heading: finalHeading,
      radius: defaultRadius,
    }
  }

  /**
   * Renders native 3D directional race marker targeting the next checkpoint
   */
  public static renderMarker(
    current: Vector3 & { radius: number },
    next?: Vector3 | null,
    isFinish = false,
    rgba: [number, number, number, number] = [255, 200, 0, 180]
  ): number {
    this.clearMarker()

    const checkpointType = isFinish ? 4 : 0 // 0 = Directional Arrow, 4 = Finish Flag
    const target = next ?? current

    this.activeMarkerHandle = CreateCheckpoint(
      checkpointType,
      current.x,
      current.y,
      current.z,
      target.x,
      target.y,
      target.z,
      current.radius,
      rgba[0],
      rgba[1],
      rgba[2],
      rgba[3],
      0
    );

    // Set height and white inner icon
    SetCheckpointCylinderHeight(this.activeMarkerHandle, 2.5, 2.5, current.radius)
    SetCheckpointRgba2(this.activeMarkerHandle, 255, 255, 255, 255) // Inner arrow/flag

    return this.activeMarkerHandle
  }

  /**
   * Safely deletes the active checkpoint handle
   */
  public static clearMarker(): void {
    if (this.activeMarkerHandle !== null) {
      DeleteCheckpoint(this.activeMarkerHandle)
      this.activeMarkerHandle = null
    }
  }
}