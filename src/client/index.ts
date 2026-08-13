import { TRACKS } from "../shared/tracks"

const INTERACTION_COORD: [number, number, number] = [460.0, -990.0, 30.0]

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

onNet("anraz-simulator:client:openUI", ()=>{
    SetNuiFocus(true, true)
    SendNUIMessage({
        action: "openMenu"
    })
})

onNet("anraz-simulator:client:initRace", async (trackKey: string, category: string)=>{
    const spawnPoint = TRACKS[trackKey]

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