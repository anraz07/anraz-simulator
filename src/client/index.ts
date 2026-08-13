import { Config } from '../shared/config';

type RaceState = 'INACTIVE' | 'WAITING_TO_START' | 'COUNTDOWN' | 'RACING' | 'FINISHED'

let raceState: RaceState = 'INACTIVE'
let currentCheckpointIndex = 0
let currentTrackData: any = null
let startTime = 0
let countdownNumber = 3
let currentTrackId = ""
let currentTrackCategory = ""
let preRaceCoords: number[] | null = null

function draw2DText(text: string, x: number, y: number, scale: number, r = 255, g = 255, b = 255, a = 255) {
    SetTextFont(4)
    SetTextScale(scale, scale)
    SetTextColour(r, g, b, a)
    SetTextDropshadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 150)
    SetTextOutline()
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(x, y)
}

function formatHudTime(ms: number) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
}

setTick(()=>{
const ped = PlayerPedId()
const [x, y, z] = GetEntityCoords(ped, false)
for (const point of Config.InteractionPoints){
    const distance = GetDistanceBetweenCoords(x as number, y as number, z as number, point.coords.x, point.coords.y, point.coords.z, true)
    if(distance < 2){
    BeginTextCommandDisplayHelp("STRING")
    AddTextComponentSubstringPlayerName("Press ~INPUT_CONTEXT~ to open Simulator")
    EndTextCommandDisplayHelp(0, false, true, -1)
    if(IsControlJustPressed(0, 38)){
        emitNet("anraz-simulator:server:requestOpen", point.job)
    }
    break
}
}

})

onNet("anraz-simulator:client:openUI", (leaderboardData: any, requestedJob: string, personalInfo: any) => {
    SetNuiFocus(true, true)
    
    SendNUIMessage({
        action: "openMenu",
        data: {
            leaderboards: leaderboardData,
            job: requestedJob,
            tracks: Config.Tracks,
            categories: Config.Categories,
            personalInfo: personalInfo
        }
    })
})

onNet("anraz-simulator:client:initRace", async (trackKey: string, category: string) => {
    const ped = PlayerPedId()
    preRaceCoords = GetEntityCoords(ped, false) as number[];
    
    const track = Config.Tracks[trackKey]
    if (!track) return console.log("ERROR: Track not found in dictionary")
    currentTrackData = track
    const spawnPoint = track.startLine
    currentCheckpointIndex = 0
    currentTrackId = trackKey
    currentTrackCategory = category
    const spawnCode = Config.Vehicles[category]
    if (!spawnCode) return console.log(`ERROR: No vehicle defined for category ${category}`)
    
    const vehicleHash = GetHashKey(spawnCode)
    RequestModel(vehicleHash)
    while (!HasModelLoaded(vehicleHash)) {
        await new Promise(resolve => setTimeout(resolve, 10))
    }
    const veh = CreateVehicle(vehicleHash, spawnPoint.x, spawnPoint.y, spawnPoint.z, spawnPoint.heading, false, false)
    TaskWarpPedIntoVehicle(ped, veh, -1)
    SetModelAsNoLongerNeeded(vehicleHash)
    FreezeEntityPosition(veh, true)
    raceState = 'WAITING_TO_START'
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

setTick(() => {
    if (raceState === 'INACTIVE' || !currentTrackData) return;
    const ped = PlayerPedId();
    const veh = GetVehiclePedIsIn(ped, false);
    
    if (raceState === 'WAITING_TO_START') {
        draw2DText("PRESS ~g~[E]~w~ TO START SIMULATION", 0.35, 0.4, 0.7);
        
        if (IsControlJustPressed(0, 38)) { // Key E
            raceState = 'COUNTDOWN';
            countdownNumber = 3;
            
            // Start countdown sequence
            const interval = setInterval(() => {
                countdownNumber--;
                if (countdownNumber < 0) {
                    clearInterval(interval);
                    FreezeEntityPosition(veh, false); // Unfreeze car!
                    startTime = GetGameTimer();
                    
                    
                    emitNet("anraz-simulator:server:beginTimer");
                    raceState = 'RACING';
                }
            }, 1000);
        }
        return;
    }
    
    if (raceState === 'COUNTDOWN') {
        const text = countdownNumber > 0 ? countdownNumber.toString() : "GO!";
        const color = countdownNumber > 0 ? [255, 255, 255] : [0, 255, 0];
        draw2DText(text, 0.48, 0.35, 2.0, color[0], color[1], color[2]);
        return;
    }
    
    if (raceState === 'RACING') {
        
        const elapsedTime = GetGameTimer() - startTime;
        draw2DText(`TIME: ${formatHudTime(elapsedTime)}`, 0.85, 0.05, 0.6);
        const checkpoints = currentTrackData.checkpoints;
        const finishLine = currentTrackData.finishLine;
        const [px, py, pz] = GetEntityCoords(ped, false);
        
        if (currentCheckpointIndex < checkpoints.length) {
            const cp = checkpoints[currentCheckpointIndex];
            DrawMarker(1, cp.x, cp.y, cp.z - 1.0, 0,0,0, 0,0,0, cp.radius, cp.radius, 2.0, 255, 255, 0, 180, false, false, 2, false, null as any, null as any, false);
            const distance = GetDistanceBetweenCoords(px as number, py as number, pz as number, cp.x, cp.y, cp.z, true);
            if (distance < cp.radius) {
                PlaySoundFrontend(-1, "CHECKPOINT_PERFECT", "HUD_MINI_GAME_SOUNDSET", true);
                currentCheckpointIndex++;
            }
        }
        
        if (currentCheckpointIndex + 1 < checkpoints.length) {
            const nextCp = checkpoints[currentCheckpointIndex + 1];
            DrawMarker(1, nextCp.x, nextCp.y, nextCp.z - 1.0, 0,0,0, 0,0,0, nextCp.radius, nextCp.radius, 1.5, 255, 255, 255, 60, false, false, 2, false, null as any, null as any, false);
        } else if (currentCheckpointIndex === checkpoints.length - 1 && finishLine) {

            DrawMarker(4, finishLine.x, finishLine.y, finishLine.z + 1.0, 0,0,0, 0,0,0, 2.0, 2.0, 2.0, 255, 0, 0, 100, false, false, 2, false, null as any, null as any, false);
        }
        if (currentCheckpointIndex >= checkpoints.length && finishLine) {
            DrawMarker(4, finishLine.x, finishLine.y, finishLine.z + 1.0, 0,0,0, 0,0,0, 3.0, 3.0, 3.0, 255, 215, 0, 255, false, false, 2, false, null as any, null as any, false);
            DrawMarker(1, finishLine.x, finishLine.y, finishLine.z - 1.0, 0,0,0, 0,0,0, finishLine.radius, finishLine.radius, 3.0, 255, 0, 0, 200, false, false, 2, false, null as any, null as any, false);
            const distanceToFinish = GetDistanceBetweenCoords(px as number, py as number, pz as number, finishLine.x, finishLine.y, finishLine.z, true);
            if (distanceToFinish < finishLine.radius) {
                const totalTimeMs = GetGameTimer() - startTime;
                raceState = 'FINISHED';
                
                PlaySoundFrontend(-1, "FIRST_PLACE", "HUD_MINI_GAME_SOUNDSET", true);
                emitNet("anraz-simulator:server:finishRace", currentTrackId, currentTrackCategory, totalTimeMs);
                setTimeout(() => {
                    if (veh !== 0) DeleteEntity(veh);
                    if (preRaceCoords) SetEntityCoords(ped, preRaceCoords[0] as number, preRaceCoords[1] as number, preRaceCoords[2] as number, false, false, false, false);
                    raceState = 'INACTIVE';
                }, 3000);
            }
        }
        return;
    }

    if (raceState === 'FINISHED') {
        draw2DText("RACE FINISHED!", 0.35, 0.4, 1.2, 0, 255, 0);
        return;
    }
});