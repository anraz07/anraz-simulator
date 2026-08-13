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
const activeRaces = new Map<string, number>()

onNet("anraz-simulator:server:requestOpen", async (requestedJob: string) =>{
    const src = source
    const Player = QBCore.Functions.GetPlayer(src)
    const personalInfo = {
        name: `${Player!.PlayerData.charinfo.firstname} ${Player!.PlayerData.charinfo.lastname}`,
        job: Player!.PlayerData.job.label,
        rank: Player!.PlayerData.job.grade.name
    };
    
    console.log(`PLayer ${src} is trying to open the simulator.`)
    if (Player?.PlayerData?.job?.name !== requestedJob){
        console.log(`Error: Player ${src} attempted to access a ${requestedJob} simulator, but they are ${Player?.PlayerData?.job?.name}`);
        return
    }else{
        const topTimes = await oxmysql.query('SELECT * FROM simulator_leaderboards WHERE job = ? ORDER BY time_ms ASC LIMIT 10', [requestedJob]);
            
            emitNet("anraz-simulator:client:openUI", src, topTimes, requestedJob, personalInfo);
            
        
    }

})

onNet("anraz-simulator:server:startSimulation", (track: string, category: string) =>{
    const src = source
    activeRaces.set(src.toString(), Date.now());
    SetPlayerRoutingBucket(src.toString(), src)
    emitNet("anraz-simulator:client:initRace", src, track, category)

    console.log(`Player ${src} isolated into Bucket ${src}. Ready for spawning.`);
})

onNet("anraz-simulator:server:beginTimer", () => {
    const src = source;
    activeRaces.set(src.toString(), Date.now());
    console.log(`Player ${src} stopwatch started on GO!`);
});

onNet("anraz-simulator:server:finishRace", async(track: string, category: string, timeMs: number)=>{
    const src = source

     const Player = QBCore.Functions.GetPlayer(src);
    if (!Player) return

    const citizenid = Player.PlayerData.citizenid
    const name = `${Player.PlayerData.charinfo.firstname} ${Player.PlayerData.charinfo.lastname}`
    const job = Player.PlayerData.job.name
    const query = 'INSERT INTO simulator_leaderboards (citizenid, name, job, track, category, time_ms) VALUES (?, ?, ?, ?, ?, ?)'
    const parameters = [citizenid, name, job, track, category, timeMs];
    const startTime = activeRaces.get(src.toString());
    
    if (!startTime) {
        console.log(`Player ${src} tried to finish a race they never started!`);
        return;
    }
    activeRaces.delete(src.toString());
    const serverElapsed = Date.now() - startTime;
    
    if (timeMs < (serverElapsed - 3000)) {
        console.log(`Player ${src} submitted ${timeMs}ms but Server tracked ${serverElapsed}ms!`);
        return;
    }
    if (timeMs < 10000) {
        console.log(` Player ${src} submitted a physically impossible time of ${timeMs}ms!`);
        return;
    }
    
    await oxmysql.insert(query, parameters)
    SetPlayerRoutingBucket(src.toString(), 0)
    
    console.log(`Saved time of ${timeMs}ms for ${name} on ${track}. Returned to Bucket 0.`)
})
