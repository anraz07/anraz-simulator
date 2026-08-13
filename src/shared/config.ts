interface Vector3{
    x: number,
    y: number,
    z: number
}

interface Vector4 extends Vector3{
    heading: number
}
interface Checkpoint extends Vector3{
    radius: number
}

interface InteractionPoint {
    job: "police" | "ambulance",
    coords: Vector3,
    radius: number
}

interface Track{
    id: string,
    name: string,
    description: string,
    mapImage: string,
    startLine: Vector4,
    finishLine: Checkpoint,
    checkpoints: Checkpoint[]
}

interface Config {
    InteractionPoints: InteractionPoint[],
    Categories: Record<string, string[]>,
    Vehicles: Record<string, string>
    Tracks: Record<string, Track>
}

export const Config: Config = {
    InteractionPoints: [
        { job: 'police', coords: { x: 460.0, y: -990.0, z: 30.0 }, radius: 2.0 },
        { job: 'ambulance', coords: { x: 300.0, y: -500.0, z: 43.0 }, radius: 2.0 }
    ],

    Categories: {
        police: ['S+', 'S', 'A', 'B'],
        ambulance: ['MS', 'MA', 'Helicopter']
    },

    Vehicles: {
        'S+': 'lp770cop',      
        'S': 'police3',
        'A': 'police2',
        'B': 'police',
        'MS': 'ambulance',
        'MA': 'emsnspeedo',
        'Helicopter': 'polmav'
    },

    Tracks: {
        sandyShoresCircuit: {
            id: 'sandyShoresCircuit',
            name: 'Sandy Shores Circuit',
            description: 'A high-speed dirt and tarmac circuit through Sandy Shores.',
            mapImage: 'https://via.placeholder.com/600x400.png?text=Sandy+Shores+Map', 
            startLine: {x: 1816.7, y: 3303.2, z: 42.2, heading: 29.3},
            finishLine: { x: 1712.5, y: 3751, z: 33.2, radius: 10},
            checkpoints: [
                { x: 1731.43, y: 3456.27, z: 38.4, radius: 10.0 },
                { x: 1659.9, y: 3573.88, z: 35, radius: 10.0 },
                { x: 1629.34, y: 3567.60, z: 34.15, radius: 10},
                { x: 1580, y: 3656.4, z: 33.84, radius: 10},
                

            ]
        }
    }
}