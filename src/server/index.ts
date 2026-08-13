import { QBCoreObject } from "../shared/qbcore"
import { oxmysql } from '@overextended/oxmysql';

oxmysql.query(`
    CREATE TABLE IF NOT EXISTS simulator_leaderboards (
      id int(11) NOT NULL AUTO_INCREMENT,
      citizenid varchar(50) NOT NULL,
      name varchar(50) NOT NULL,
      job varchar(50) NOT NULL,
      track varchar(50) NOT NULL,
      category varchar(50) NOT NULL,
      time_ms int(11) NOT NULL,
      date timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id)
    );
`);

const QBCore = (exports as any)['qb-core'].GetCoreObject() as QBCoreObject

onNet("anraz-simulator:server:requestOpen", async () =>{
    const src = source
    const Player = QBCore.Functions.GetPlayer(src)
    
    console.log(`PLayer ${src} is trying to open the simulator.`)
    if (Player?.PlayerData?.job?.name !== "police"){
        console.log(`Error, invalid job or player undefined`)
        return
    }else{
        const topTimes = await oxmysql.query('SELECT * FROM simulator_leaderboards ORDER BY time_ms ASC LIMIT 10');
            
            emitNet("anraz-simulator:client:openUI", src, topTimes);
            
        
    }

})

onNet("anraz-simulator:server:startSimulation", (track: string, category: string) =>{
    const src = source
    
    SetPlayerRoutingBucket(src.toString(), src)
    emitNet("anraz-simulator:client:initRace", src, track, category)

    console.log(`Player ${src} isolated into Bucket ${src}. Ready for spawning.`);
})

onNet("anraz-simulator:server:finishRace", async(track: string, category: string, timeMs: number)=>{
    const src = source

     const Player = (exports as any)['qb-core'].GetCoreObject().Functions.GetPlayer(src);
    if (!Player) return

    const citizenid = Player.PlayerData.citizenid
    const name = `${Player.PlayerData.charinfo.firstname} ${Player.PlayerData.charinfo.lastname}`
    const job = Player.PlayerData.job.name
    const query = 'INSERT INTO simulator_leaderboards (citizenid, name, job, track, category, time_ms) VALUES (?, ?, ?, ?, ?, ?)'
    const parameters = [citizenid, name, job, track, category, timeMs];
    
    await oxmysql.insert(query, parameters)
    SetPlayerRoutingBucket(src.toString(), 0)
    
    console.log(`Saved time of ${timeMs}ms for ${name} on ${track}. Returned to Bucket 0.`)
})
