
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

RegisterNuiCallbackType("closeMenu")
on("__cfx_nui:closeMenu", (data:any, cb: (data: any)=> void)=>{
    SetNuiFocus(false, false)
    cb({})
})