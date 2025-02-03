import config from '@/configs/env.config';
import logger from '@/configs/logger.config';
import { IConnection, IRoom } from '@/shared/services/socket/interfaces/socket.interface';
import * as express from 'express';
import * as http from 'http';
import _ from 'lodash';
import * as os from 'os';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../../enums';
import { verifyToken } from '@/shared/utilities/encryption.utility';

let activeConnections = 0;

export class SocketService {
    async init(app: express.Application) {
        // 1. Create Server
        this.server = http.createServer(app);
        this.socketServer = new Server(this.server, {
            allowEIO3: true,
            cors: {
                origin: true,
                credentials: true,
            },
            pingTimeout: 60000,
            pingInterval: 20000,
            connectionStateRecovery: {
                // the backup duration of the sessions and the packets
                maxDisconnectionDuration: 2 * 60 * 1000,
                // whether to skip middlewares upon successful recovery
                skipMiddlewares: true,
            },
        });

        // 4. Auth middleware
        this.socketServer.use(this.authMiddleware.bind(this));

        // 5. Handle Connection
        this.socketServer.on(SOCKET_EVENTS.CONNECTION, this.onConnection.bind(this));
        this.serverId = os.hostname() + '-' + process.pid;

        // 6. Run Socket Server
        this.server.listen(config.socket.port, () => {
            logger.info(`Socket Server is running on port ${config.socket.port}`);
            logger.info('🚀 ~ SocketService ~ init ~ this.serverId:', this.serverId);
        });
    }
    private server: http.Server;
    private socketServer: Server;
    private sockets: { [x: string]: Socket } = {};
    connections: { [x: string]: IConnection } = {};
    private serverId: string;
    rooms: { [x: string]: IRoom } = {};

    private async authMiddleware(socket: Socket, next: any) {
        // const { token, uid } = socket.handshake.query
        console.log('🚀 ~ SocketService ~ connected ~ result:');
        const token = socket.handshake.headers.authorization;
        if (!token) return;
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        try {
            // 1. Validate token with user
            if (!token) return next(new Error('authentication error'));
            const result = await verifyToken(bearerToken);
            // console.log("🚀 ~ SocketService ~ connected ~ result:", result.payload.user_id)
            const uid = result.id;

            // 2. Cache connection
            if (!this.connections[uid])
                this.connections[uid] = {
                    uid,
                    sockets: [],
                };
            this.connections[uid].sockets.push(socket.id);
            this.sockets[socket.id] = socket;
            _.set(socket, 'uid', uid);
            return next();
        } catch (err) {
            return next(err);
        }
    }

    private getSocketsFromUserId(userId: string): string[] {
        const sockets = this.connections[userId] ? this.connections[userId].sockets : [];
        console.log('🚀 ~ SocketService ~ getSocketsFromUserId ~ sockets:', sockets);
        return this.eliminateDuplicates(sockets);
    }

    private async onConnection(socket: Socket) {
        const token = socket.handshake.headers.authorization;
        if (!token) return;
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        const decodeToken = await verifyToken(bearerToken);
        const userId = decodeToken.id;
        const connection = this.getConnectionFromSocketId(socket.id);
        console.log('🚀 ~ SocketService ~ onConnection ~ connection:', connection);

        activeConnections++;
        logger.warn(`active connections count: ${activeConnections}`);
        socket.on(SOCKET_EVENTS.DISCONNECT, this.handleSocketEvent(this.onClientDisconnect, socket));
    }

    private handleSocketEvent(func: (socket: Socket, ...params: any[]) => any, socket: Socket) {
        return (...args: any[]) => func.bind(this)(socket, ...args);
    }
    public getConnectionFromSocketId(socketId: string): IConnection {
        const uids = Object.keys(this.connections);
        let result = undefined;
        uids.forEach((uid) => {
            this.connections[uid].sockets.forEach((e: any) => {
                if (e === socketId) {
                    result = this.connections[uid];
                }
            });
        });

        return result;
    }

    private async onClientDisconnect(socket: Socket) {
        // 1. Clear socket
        delete this.sockets[socket.id];
        this.socketServer.sockets.sockets.delete(socket.id);

        const connection = this.getConnectionFromSocketId(socket.id);

        activeConnections--;

        console.log('🆘🆘🆘🆘🆘🆘🆘🆘 ~ SocketService ~ onClientDisconnect ~ user_id:', connection?.uid);
        logger.warn(`active connections count: ${activeConnections}`);

        if (connection) {
            _.remove(connection.sockets, (s) => s == socket.id);
            const userId = connection?.uid;
        }

        // const token = socket.handshake.headers.authorization;
        // if (!token) return;
        // const bearer = token.split(' ');
        // const bearerToken = bearer[1];
        // const result = await Encryption.verifyToken(bearerToken);
        // const userId = result.id;
    }

    sendAll(msg: any, event: string) {
        this.socketServer.emit(event || 'message', msg);
    }

    sendToChannel(channel: string, msg: any, event: SOCKET_EVENTS) {
        if (!event) {
            return;
        }
        this.socketServer.to(channel).emit(event, msg);
    }

    async sendToUsers(uids: string[], msg: any, event?: any) {
        if (!uids) return;

        // for (const uid of uids) {
        //     const sockets = await this.pubClient.sMembers(`user:${uid}:sockets`);

        //     for (const socketId of sockets) {
        //         console.log(`🚀 Emitting message to socket ID ${socketId} from server ${this.serverId}.`);
        //         this.socketServer.to(socketId).emit(event || 'message', msg);
        //         // } else {
        //         //     console.log(`❌ Socket with ID ${socketId} not found.`)
        //         // }
        //     }
        // }
    }
    addUsersToChannel(uids: string[], channel: string) {
        uids.forEach((uid) => {
            const connection = this.connections[uid];
            if (connection) {
                connection.sockets.forEach((s) => this.joinChannel(this.sockets[s], channel, uid));
            }
        });
    }

    public emitToUser(userId: string, key: string, data: any) {
        const socketIds = this.getSocketsFromUserId(userId);
        socketIds.forEach((socketId) => {
            const clientSocket = this.socketServer.sockets.sockets.get(socketId); // Updated line
            console.log('🚀 ~ SocketService ~ socketIds ~ send ~ clientSocket:', clientSocket);

            if (clientSocket) {
                clientSocket.emit(key, data);
            }
        });
    }

    removeUsersFromChannel(uids: string[], channel: string) {
        for (const uid of uids) {
            const connection = this.connections[uid];
            if (connection) {
                for (const s of connection.sockets) {
                    this.onLeaveChannel(this.sockets[s], channel, uid);
                }
            }
        }
    }

    private joinChannel(socket: Socket, channel: string, uid: string) {
        // Join socket to channel
        if (socket) {
            socket.join(channel);
        }
    }

    private onLeaveChannel(socket: Socket, channel: string, uid: string) {
        // Clear socket from channel
        if (socket) {
            socket.leave(channel);

            if (this.rooms[channel]) {
                const indexSocket = this.rooms[channel].sockets.indexOf(socket.id);
                if (indexSocket > -1) {
                    this.rooms[channel].sockets.splice(indexSocket, 1);
                }
                const indexUid = this.rooms[channel].uids.indexOf(uid);
                if (indexUid > -1) {
                    this.rooms[channel].uids.splice(indexUid, 1);
                }
            }
        }
    }
    private eliminateDuplicates(arr: string[]) {
        const len = arr.length,
            out = [],
            obj: any = {};
        for (let i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (const i in obj) {
            out.push(i);
        }
        return out;
    }

    logCCU() {
        console.log('===> 🥕🥕🥕  => authMiddleware => this.connections:', this.connections);

        return activeConnections;
    }

    async triggerSocketEventForAllUser(eventName: string, message: any) {}
}

const socketService = new SocketService();

export default socketService;
