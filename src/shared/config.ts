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
            startLine: {x: 1816.7, y: 3303.2, z: 41, heading: 29.3},
            finishLine: { x: 1712.5, y: 3751, z: 32.2, radius: 7},
            checkpoints: [
                { x: 1731.43, y: 3456.27, z: 37.4, radius: 7 },
                { x: 1659.9, y: 3573.88, z: 34, radius: 7 },
                { x: 1629.34, y: 3567.60, z: 33.15, radius: 7},
                { x: 1580, y: 3656.4, z: 32.84, radius: 7},
                

            ]
        },
        lspdCircuit: {
        "id": "lspdCircuit",
        "name": "LSPD Circuit",
        "description": "Recorded in-game",
        "mapImage": "https://via.placeholder.com/600x400.png?text=LSPD%20Circuit",
        "startLine": {"x": 401.71, "y": -980.16, "z": 28.76, "heading": 0.43 },
        "finishLine": { "x": 399.25, "y": -990, "z": 28.47, "radius": 10 },
        "checkpoints": [
            {
                "x": 399.75,
                "y": -978.25,
                "z": 28.38,
                "radius": 10
            },
            {
                "x": 376,
                "y": -956.75,
                "z": 28.41,
                "radius": 10
            },
            {
                "x": 337,
                "y": -955.75,
                "z": 28.41,
                "radius": 10
            },
            {
                "x": 298.25,
                "y": -952.25,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 257.75,
                "y": -963,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 232,
                "y": -987,
                "z": 28.28,
                "radius": 10
            },
            {
                "x": 220.75,
                "y": -1018.25,
                "z": 28.34,
                "radius": 10
            },
            {
                "x": 206.75,
                "y": -1058.5,
                "z": 28.16,
                "radius": 10
            },
            {
                "x": 205.25,
                "y": -1100.25,
                "z": 28.34,
                "radius": 10
            },
            {
                "x": 210.5,
                "y": -1130.5,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 205.75,
                "y": -1162.75,
                "z": 28.34,
                "radius": 10
            },
            {
                "x": 209.5,
                "y": -1198.25,
                "z": 28.34,
                "radius": 10
            },
            {
                "x": 239.5,
                "y": -1223.5,
                "z": 28.19,
                "radius": 10
            },
            {
                "x": 275.5,
                "y": -1223,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 297,
                "y": -1195.75,
                "z": 28.22,
                "radius": 10
            },
            {
                "x": 269.5,
                "y": -1181.25,
                "z": 28.5,
                "radius": 10
            },
            {
                "x": 236,
                "y": -1181.5,
                "z": 28.22,
                "radius": 10
            },
            {
                "x": 229,
                "y": -1214.25,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 222.5,
                "y": -1245.25,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 228.25,
                "y": -1278,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 255.25,
                "y": -1296.75,
                "z": 28.22,
                "radius": 10
            },
            {
                "x": 290.75,
                "y": -1296.75,
                "z": 29.22,
                "radius": 10
            },
            {
                "x": 326,
                "y": -1291,
                "z": 30.75,
                "radius": 10
            },
            {
                "x": 332.25,
                "y": -1261.25,
                "z": 30.63,
                "radius": 10
            },
            {
                "x": 301.77,
                "y": -1243.98,
                "z": 28.76,
                "radius": 10
            },
            {
                "x": 269.25,
                "y": -1244,
                "z": 28.22,
                "radius": 10
            },
            {
                "x": 239.25,
                "y": -1245,
                "z": 28.22,
                "radius": 10
            },
            {
                "x": 229,
                "y": -1214.25,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 225,
                "y": -1178.5,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 221.25,
                "y": -1149,
                "z": 28.31,
                "radius": 10
            },
            {
                "x": 249.25,
                "y": -1131,
                "z": 28.38,
                "radius": 10
            },
            {
                "x": 285.25,
                "y": -1131.5,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 313.75,
                "y": -1132,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 351.25,
                "y": -1131.75,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 387.25,
                "y": -1129.25,
                "z": 28.41,
                "radius": 10
            },
            {
                "x": 398.25,
                "y": -1095.75,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 398.25,
                "y": -1063,
                "z": 28.44,
                "radius": 10
            },
            {
                "x": 398.25,
                "y": -1029,
                "z": 28.47,
                "radius": 10
            }
            ]
        }
    }
}