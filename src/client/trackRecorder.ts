import { CheckpointHelper, CheckpointData, Vector4 } from './checkpointHelper'

export class TrackRecorder {
  private static isRecording = false
  private static trackId = ''
  private static startLine: Vector4 | null = null
  private static recordedPoints: CheckpointData[] = []
  private static blips: number[] = []

  public static start(trackId: string) {
    if (this.isRecording) {
      console.log('Already recording a track. Use /track_cancel or /track_save first.')
      return
    }

    const ped = PlayerPedId()
    const veh = GetVehiclePedIsIn(ped, false)

    if (veh === 0) {
      console.log('You must be inside a vehicle at your starting line to begin recording!')
      return
    }

    this.trackId = trackId
    this.recordedPoints = []
    this.blips = []

    // 1. Capture Start Line
    const [x, y, z] = GetEntityCoords(veh, false)
    const heading = GetEntityHeading(veh)

    this.startLine = {
      x: CheckpointHelper.round(x as number),
      y: CheckpointHelper.round(y as number),
      z: CheckpointHelper.round(z as number),
      heading: CheckpointHelper.round(heading),
    }

    this.isRecording = true
    console.log(`[TrackRecorder] Started recording track: ${trackId}. Drive the route!`)
    PlaySoundFrontend(-1, "RACE_START_GO", "HUD_MINI_GAME_SOUNDSET", true)
  }

  public static update() {
    if (!this.isRecording) return

    const lastPoint = this.recordedPoints.length > 0 
      ? this.recordedPoints[this.recordedPoints.length - 1] 
      : null

    // Attempt capture every tick (gated by distance and road snapping)
    const newPoint = CheckpointHelper.tryCaptureCurrentPosition(
      lastPoint as CheckpointData || null,
      this.recordedPoints.length + 1,
      {
        minDistance: 35.0,    // Space checkpoints ~35 meters apart
        snapToRoad: true,     // Automatically snap to road center
        maxSnapDistance: 10.0,
        defaultRadius: 10.0,
      }
    )

    if (newPoint) {
      this.recordedPoints.push(newPoint)
      PlaySoundFrontend(-1, "CHECKPOINT_PERFECT", "HUD_MINI_GAME_SOUNDSET", true)

      // Create a minimap blip for visual route feedback
      const blip = AddBlipForCoord(newPoint.x, newPoint.y, newPoint.z)
      SetBlipSprite(blip, 1)
      SetBlipColour(blip, 5) // Yellow
      SetBlipScale(blip, 0.7)
      this.blips.push(blip)

      console.log(`[TrackRecorder] Captured Checkpoint #${newPoint.id} at [${newPoint.x}, ${newPoint.y}, ${newPoint.z}]`)
    }

    // Render on-screen HUD while recording
    SetTextFont(4)
    SetTextScale(0.5, 0.5)
    SetTextColour(255, 255, 255, 255)
    SetTextOutline()
    SetTextEntry("STRING")
    AddTextComponentString(`~y~RECORDING TRACK: ~w~${this.trackId} | Checkpoints: ~g~${this.recordedPoints.length}~w~ | /track_save to finish`)
    DrawText(0.35, 0.05)
  }

  public static save(trackName = 'Custom Track', description = 'Recorded in-game') {
    if (!this.isRecording || this.recordedPoints.length < 2) {
      console.log('[TrackRecorder] Cannot save: Need at least 2 checkpoints recorded.')
      return
    }

    // Pop the very last checkpoint to serve as the Finish Line
    const finish = this.recordedPoints.pop()!

    // Build the exact TypeScript Config output
    const trackOutput = {
      id: this.trackId,
      name: trackName,
      description: description,
      mapImage: 'https://via.placeholder.com/600x400.png?text=' + encodeURIComponent(trackName),
      startLine: this.startLine,
      finishLine: { x: finish.x, y: finish.y, z: finish.z, radius: finish.radius },
      checkpoints: this.recordedPoints.map(p => ({ x: p.x, y: p.y, z: p.z, radius: p.radius })),
    };

    console.log('================== [COPY TRACK CONFIG BELOW] ==================')
    console.log(`${this.trackId}: ${JSON.stringify(trackOutput, null, 2)},`)
    console.log('================================================================')

    this.cleanup()
    PlaySoundFrontend(-1, "FIRST_PLACE", "HUD_MINI_GAME_SOUNDSET", true)
  }

  public static cancel() {
    if (!this.isRecording) return;
    this.cleanup()
    console.log('[TrackRecorder] Recording canceled.')
  }

  private static cleanup() {
    this.isRecording = false
    this.blips.forEach(b => RemoveBlip(b))
    this.blips = []
    this.recordedPoints = []
    this.startLine = null
    CheckpointHelper.clearMarker()
  }

  public static get isActive(): boolean {
    return this.isRecording
  }
}