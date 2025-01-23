export interface IConnection {
    uid: string;
    sockets: string[];
}

export interface IRoom {
    sockets: string[];
    uids: string[];
}
