import { QBCoreObject } from "../shared/qbcore"

const QBCore = (exports as any)['qb-core'].GetCoreObject() as QBCoreObject

onNet("anraz-simulator:server:requestOpen", () =>{
    const src = source
    const Player = QBCore.Functions.GetPlayer(src)
    console.log(`PLayer ${src} is trying to open the simulator.`)
    if (Player?.PlayerData?.job?.name !== "police"){
        console.log(`Error, invalid job or player undefined`)
        return
    }else{
        emitNet("anraz-simulator:client:openUI", src)
    }

})

onNet("anraz-simulator:server:startSimulation", (track: string, category: string) =>{
    const src = source
    console.log(`Player ${src} wants to play on track: ${track} with category: ${category}`)
})

