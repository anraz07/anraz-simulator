export interface TrackData{
    x: number,
    y: number,
    z: number,
    heading: number,
    checkpoints: {x: number, y: number, z: number, radius: number}[]
}

export const TRACKS: Record<string, TrackData> = {
    sandyShoresCircuit: {x: 1735.0, y: 3290.0, z: 41.0, heading: 195.0,
        checkpoints: [
            { x: 1700.0, y: 3250.0, z: 41.0, radius: 10.0 },
            
            { x: 1650.0, y: 3200.0, z: 41.0, radius: 10.0 }
        ]
    },
    paletoBaySprint: {x: 130.0, y: 6600.0, z: 31.0, heading: 220.0,
        checkpoints:[]
    }
}