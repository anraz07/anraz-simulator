export interface QBCorePlayer {
    PlayerData: {
        citizenid: string;
        charinfo: {
            firstname: string;
            lastname: string;
        };
        job: {
            name: string;
            label: string;
            grade: {
                name: string;
                level: number;
            };
        };
    }
}

export interface QBCoreObject {
    Functions: {
        GetPlayer: (source: string | number) => QBCorePlayer | undefined
    }
}
