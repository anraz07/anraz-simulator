export interface QBCorePlayerData {
  citizenid: string;
  cid: number;
  money: {
    cash: number;
    bank: number;
    crypto: number;
  };
  charinfo: {
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: number;
    nationality: string;
    phone: string;
    account: string;
  };
  job: {
    name: string;
    label: string;
    payment: number;
    onduty: boolean;
    isboss: boolean;
    grade: {
      name: string;
      level: number;
    };
  };
  gang: {
    name: string;
    label: string;
    isboss: boolean;
    grade: {
      name: string;
      level: number;
    };
  };
  metadata: Record<string, unknown>;
  items: Record<number, unknown>;
}

export interface QBCorePlayer {
  PlayerData: QBCorePlayerData;
  Functions: {
    SetJob(job: string, grade: number | string): boolean;
    SetGang(gang: string, grade: number | string): boolean;
    AddMoney(moneytype: 'cash' | 'bank' | 'crypto', amount: number, reason?: string): boolean;
    RemoveMoney(moneytype: 'cash' | 'bank' | 'crypto', amount: number, reason?: string): boolean;
    GetMoney(moneytype: 'cash' | 'bank' | 'crypto'): number;
    Save(): void;
    AddItem(item: string, amount: number, slot?: number, info?: Record<string, unknown>): boolean;
    RemoveItem(item: string, amount: number, slot?: number): boolean;
    GetItemByName(item: string): unknown;
    GetItemsByName(item: string): unknown[];
    ClearInventory(filterItems?: string | string[]): void;
  };
}

export interface QBCoreServer {
  Functions: {
    GetPlayer(source: number | string): QBCorePlayer | null;
    GetPlayerByCitizenId(citizenid: string): QBCorePlayer | null;
    GetPlayerByPhone(number: string): QBCorePlayer | null;
    GetPlayers(): number[];
    CreateCallback(name: string, cb: (source: number, cb: Function, ...args: any[]) => void): void;
    Notify(source: number, text: string, type?: 'primary' | 'success' | 'error', length?: number): void;
  };
  Shared: {
    Jobs: Record<string, unknown>;
    Vehicles: Record<string, unknown>;
    Items: Record<string, unknown>;
  };
}

export interface QBCoreClient {
  Functions: {
    GetPlayerData(): QBCorePlayerData;
    GetCoords(entity: number): [number, number, number, number];
    HasItem(items: string | string[], amount?: number): boolean;
    TriggerCallback(name: string, cb: (...args: any[]) => void, ...args: any[]): void;
    Notify(text: string, type?: 'primary' | 'success' | 'error', length?: number): void;
  };
}

declare global {
  interface CitizenExports {
    'qb-core': {
      GetCoreObject(): QBCoreServer & QBCoreClient;
      GetPlayer(source: number): QBCorePlayer | null;
    };
  }
}