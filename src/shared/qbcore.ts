export interface QBCorePlayer{
    PlayerData: {
        job:{
            name: string
        }
    }
}

export interface QBCoreObject {
    Functions: {
        GetPlayer: (source: string | number) => QBCorePlayer | undefined
    }
}
