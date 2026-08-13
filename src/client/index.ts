import { TRACKS } from '../shared/tracks';

const INTERACTION_COORD: [number, number, number] = [460.0, -990.0, 30.0]
let isRacing = false
let currentCheckpointIndex = 0
let currentTrackData: any = null
let startTime = 0
let currentTrackId = ""
let currentTrackCategory = ""

setTick(()=>{
const ped = PlayerPedId()
const [x, y, z] = GetEntityCoords(ped, false)
const distance = GetDistanceBetweenCoords(x as number, y as number, z as number, INTERACTION_COORD[0], INTERACTION_COORD[1], INTERACTION_COORD[2], true)
if(distance < 2){
    BeginTextCommandDisplayHelp("STRING")
    AddTextComponentSubstringPlayerName("Press ~INPUT_CONTEXT~ to open Simulator")
    EndTextCommandDisplayHelp(0, false, true, -1)
    if(IsControlJustPressed(0, 38)){
        emitNet("anraz-simulator:server:requestOpen")
    }
}
})

onNet("anraz-simulator:client:openUI", (leaderboardData: any)=>{
    SetNuiFocus(true, true)
    SendNUIMessage({
        action: "openMenu",
        data: leaderboardData
    })
})

onNet("anraz-simulator:client:initRace", async (trackKey: string, category: string)=>{
    const spawnPoint = TRACKS[trackKey]
    currentTrackData = spawnPoint;
    currentCheckpointIndex = 0;
    isRacing = true;
    startTime = GetGameTimer();
    currentTrackId = trackKey
    currentTrackCategory = category

    if(!spawnPoint) return console.log("ERROR: Track not found in dictionary")
    
    const vehicleHash = GetHashKey("t20")

    RequestModel(vehicleHash)
    while (!HasModelLoaded(vehicleHash)){
        await new Promise(resolve => setTimeout(resolve, 10))
    }

    const veh = CreateVehicle(vehicleHash, spawnPoint.x, spawnPoint.y, spawnPoint.z, spawnPoint.heading, false, false)

    TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
    SetModelAsNoLongerNeeded(vehicleHash)

    console.log(`Successfully spawned into the simulator`)
})

RegisterNuiCallbackType("closeMenu")
on("__cfx_nui:closeMenu", (data:any, cb: (data: any)=> void)=>{
    SetNuiFocus(false, false)
    cb({})
})

RegisterNuiCallbackType("startSimulation")
on("__cfx_nui:startSimulation", (data:any, cb: (data:any)=> void)=>{
    SetNuiFocus(false, false)
    console.log(data.track, data.category)
    emitNet("anraz-simulator:server:startSimulation", data.track, data.category)
    cb({})
})

setTick(()=>{
    if (!isRacing || !currentTrackData) return

    const checkpoints = currentTrackData.checkpoints
    if(currentCheckpointIndex >= checkpoints.length){
        isRacing= false
        const endTime = GetGameTimer()
        const totalTimeMs = endTime - startTime
        emitNet("anraz-simulator:server:finishRace", currentTrackId, currentTrackCategory, totalTimeMs)
        return
    }

    const cp = checkpoints[currentCheckpointIndex]

    DrawMarker(
        1, //id of the cylinder
        cp.x, cp.y, cp.z - 1.0, //coords, -1 on z so it sits on the road
        0, 0, 0, 0, 0, 0, //rotation numbers (we obviously don't use it)
        cp.radius, cp.radius, 2.0, //scale (width, length, height)
        255, 255, 0, 150, //color
        false, false, 2, false, null as any, null as any, false
    )

    const [px, py, pz] = GetEntityCoords(PlayerPedId(), false)
    const distance = GetDistanceBetweenCoords(px as number, py as number, pz as number, cp.x, cp.y, cp.z, true)

    if(distance < cp.radius){
        console.log(`Hit Checkpoing ${currentCheckpointIndex +1}!`)
        currentCheckpointIndex++
    }
})