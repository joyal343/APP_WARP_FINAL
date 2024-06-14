import {WebSocket} from "ws";
var socket = new WebSocket("ws://127.0.0.1:3000" );
socket.binaryType = "arraybuffer";
socket.onopen = function () {
        // Join Zone
        console.log("WE HAVE CONN");
        joinZone("JOYAL_JOSEPH", "123");
};

socket.onclose = function () {
    console.log("CONN ENDED");
    // if (WarpClient.recoveryAllowance > 0 && that.SessionID != 0) {
    //     console.log("Session ENDED");
    // } else  {
    //     console.log("Session ENDED");
    //     console.log("that.SessionID = 0");
    // }
};

socket.onmessage = function (msg) {
    onMessage(msg);
};
var joinZone = function (user, authData) {
    // HELLO IMPORTANT! 
    console.log("JOINING ZONE!!!!!!!!!!!!!!!")
    var payload = RequestBuilder.buildAuthRequest(0, "ab", user, authData);
    console.log(payload);
    var data = RequestBuilder.buildWarpRequest(0, 1, payload, true);
    console.log(data);
    console.log("SENDING DATA");
    sendMessage(data.buffer);
    
};
var sendMessage = function (data) {
    socket.send(data);
};
/// ON MESSAGE
var onMessage = function (msg) {
    var bytearray = new Uint8Array(msg.data);
    var numRead = bytearray.length;
    var numDecoded = 0;
    console.log("Message Recieved");
    console.log(bytearray);
    console.log(bytearray[numDecoded]);
    // while (numDecoded < numRead) {
    //     if (bytearray[numDecoded] == 1) {
    //         // var res = new AppWarp.Response(bytearray, numDecoded);
    //         var res = new Response(bytearray,numDecoded);
    //         console.log(res);
    //         numDecoded += handleResponse(res);
    //         break;
    //     } 
    //     console.log("FAILURE ON MESSAGE");
    //     break;
    // }
    while (numDecoded < numRead) {
        if (bytearray[numDecoded] == 1) {
            var res = new Response(bytearray, numDecoded);
            numDecoded += handleResponse(res);
        } else if (bytearray[numDecoded] == 2) {
            var notify = new Notify(bytearray, numDecoded);
            numDecoded += handleNotify(notify);
        }
    }
};
/////////////////// UTILITY
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var getODataUTCDateFilter = function () {
    var date = new Date();
    var monthString;
    var rawMonth = (date.getUTCMonth() + 1).toString();
    if (rawMonth.length == 1) {
        monthString = "0" + rawMonth;
    } else {
        monthString = rawMonth;
    }

    var dateString;
    var rawDate = date.getUTCDate().toString();
    if (rawDate.length == 1) {
        dateString = "0" + rawDate;
    } else {
        dateString = rawDate;
    }

    var DateFilter = "";
    DateFilter += date.getUTCFullYear() + "-";
    DateFilter += monthString + "-";
    DateFilter += dateString;
    DateFilter += "T" + date.getUTCHours() + ":";
    DateFilter += date.getUTCMinutes() + ":";
    DateFilter += date.getUTCSeconds() + ".";
    DateFilter += date.getUTCMilliseconds();
    DateFilter += "Z";
    return DateFilter;
}
///////////////////////////// REQUEST BUILDER
var RequestBuilder = {};

RequestBuilder.buildAuthRequest = function (recovery, apiKey, user, authData) {
     var timeStamp = getODataUTCDateFilter();

    var json = {};
    json.apiKey = apiKey;
    json.version = "JS_1.4";
    json.timeStamp = timeStamp;
    json.user = user;
    json.authData = authData;
    json.keepalive = 6;
    json.recoverytime = recovery;

    return JSON.stringify(json);
};

RequestBuilder.buildWarpRequest = function (AppWarpSessionId, requestType, payload, isText, reserved) {
    if (typeof reserved === "undefined") { reserved = 0; }
    var bytearray = new Uint8Array(16 + payload.length);
    bytearray[0] = 0;
    bytearray[1] = requestType;

    bytearray[2] = AppWarpSessionId >>> 24;
    bytearray[3] = AppWarpSessionId >>> 16;
    bytearray[4] = AppWarpSessionId >>> 8;
    bytearray[5] = AppWarpSessionId;

    for (var i = 6; i <= 9; i++) {
        bytearray[i] = 0;
    }

    bytearray[10] = reserved;

    if (payload.length > 0 && requestType != 13) {
        bytearray[11] = 2;
    } else {
        bytearray[11] = 1;
    }

    var payloadSize = payload.length;
    bytearray[12] = payloadSize >>> 24;
    bytearray[13] = payloadSize >>> 16;
    bytearray[14] = payloadSize >>> 8;
    bytearray[15] = payloadSize;

    if (isText == false) {
        for (var i = 0; i < payloadSize; ++i) {
            bytearray[16 + i] = payload[i];
        }
    } else {
        for (var i = 0; i < payloadSize; ++i) {
            bytearray[16 + i] = payload.charCodeAt(i);
        }
    }
    return bytearray;
};
RequestBuilder.buildLobbyRequest = function () {
    var params = {};
    params.isPrimary = true;
    return JSON.stringify(params);
};
RequestBuilder.buildRoomRequest = function (roomId) {
    var params = {};
    params.id = roomId;
    return JSON.stringify(params);
};
////////////////////////////// Response
var bytesToIntger = function (bytes, offset) {
    var value = 0;
    for (var i = 0; i < 4; i++) {
        value = (value << 8) + (bytes[offset + i] & 0xff);
    }

    return value;
};
class Response {
    constructor(responseBytes, startIndex) {
        this.messageType = responseBytes[startIndex + 0];
        this.requestType = responseBytes[startIndex + 1];
        this.resultCode = responseBytes[startIndex + 2];
        this.reserved = responseBytes[startIndex + 3];
        this.payLoadType = responseBytes[startIndex + 4];
        this.payLoadSize = bytesToIntger(responseBytes, startIndex + 5);
        this.payLoad = new Uint8Array(this.payLoadSize);
        for (let i = 0; i < this.payLoadSize; i++) {
            this.payLoad[i] = responseBytes[9 + startIndex + i];
        }
    }

    getMessageType() {
        return this.messageType;
    }

    getRequestType() {
        return this.requestType;
    }

    getResultCode() {
        return this.resultCode;
    }

    getPayloadType() {
        return this.payLoadType;
    }

    getPayloadSize() {
        return this.payLoadSize;
    }

    getPayload() {
        return this.payLoad;
    }
    
    getPayloadString() {
        var array = this.payLoad;
        var str = "";
        for (var i = 0; i < array.length; i++) {
            var char = array[i];
            str += String.fromCharCode(char);
        }
        return str;
    }

    // debug() {
    //     console.log("========Response========");
    //     console.log("messageType : " + AppWarp.MessageType[this.getMessageType()]);
    //     console.log("requestType : " + AppWarp.RequestType[this.getRequestType()]);
    //     console.log("resultCode  : " + this.getResultCode());
    //     console.log("payLoadType : " + AppWarp.PayloadType[this.getPayloadType()]);
    //     console.log("payLoadSize : " + this.getPayloadSize());
    //     console.log("payLoad     : " + this.getPayloadString());
    // }
}
////////////////////////////////////////////   HANDLERS


var SessionID


var handleNotify = function (res) {
    if (res.getUpdateType() == 9) {
        console.log("CHAT");
    } else if (res.getUpdateType() == 3) {
        console.log("User Joined The Lobby");
        var _lobby = new Lobby(0, res.getPayloadString());
        console.log(_lobby);
        var user = (JSON.parse(res.getPayloadString())).user;
        console.log(user);

    }
    return 8 + res.getPayloadSize();
}
var handleResponse = function (res) {
    console.log(res.getRequestType());
    if (res.getRequestType() == 1) {
        if (res.getResultCode() == 0) {
            var json = JSON.parse(res.getPayloadString());
            SessionID = json.sessionid;
            var isConnected = true;
            console.log("SessionID");
            console.log(SessionID);
            console.log("Connected");
            console.log(isConnected);
            joinLobby(SessionID);
        }
    } else if (res.getRequestType() == 2){
        var _lobby = new Lobby(res.getResultCode(), res.getPayloadString());
        console.log("GOT LOBBY");
        var jsonVals = JSON.parse(res.getPayloadString())
        console.log(jsonVals);
        console.log(_lobby.getLobbyId());
        console.log(_lobby.getIsPrimary());
        console.log("LOBBY //////////");
        getAllRooms(SessionID);
    } else if (res.getRequestType() == 17) {
        console.log("AllRooms Response Received");
        var _rooms = new AllRoomsEvent(res.getResultCode(), res.getPayloadString());
        console.log(_rooms);
        var rooms = _rooms.getRoomIds();
        console.log(rooms);
        console.log("JOIN ROOM REQUEST");
        joinRoom(SessionID,rooms[0]);    
        
    } else if (res.getRequestType() == 7 ) {
        console.log("ENTERED A ROOM")
        var active_room = new Room(res.getResultCode(), res.getPayloadString());
        console.log(active_room);
        getOnlineUsers(SessionID);
    } else if (res.getRequestType() == 18) {
        console.log("USERS");
        var _users = new AllUsersEvent(res.getResultCode(), res.getPayloadString());
        console.log(_users);
        setTimeout(()=>{getOnlineUsers(SessionID);},3000)
        

    } 
    return 9 + res.getPayloadSize();
}

//////////////////////////////// JOINING LOBBY
var joinLobby = function (sessionID) {
    var payload = RequestBuilder.buildLobbyRequest();
    var data = RequestBuilder.buildWarpRequest(sessionID, 2 , payload, true);
    sendMessage(data.buffer);
};

var joinRoom = function (sessionID,roomId) {
    var payload = RequestBuilder.buildRoomRequest(roomId);
    var data = RequestBuilder.buildWarpRequest(sessionID, 7, payload, true);
    sendMessage(data.buffer);
};

var getAllRooms = function (sessionID) {
    var data = RequestBuilder.buildWarpRequest(sessionID, 17, "", true);
    sendMessage(data.buffer);
};

var getOnlineUsers = function (sessionID) {
    var data = RequestBuilder.buildWarpRequest(sessionID, 18, "", true);
    sendMessage(data.buffer);
};
class AllUsersEvent {
    constructor(result, payload) {
        this.json = JSON.parse(payload);
        this.res = result;
    }

    getResult() {
        return this.res;
    }

    getUsernames() {
        const usernames = this.json.names;
        let userNamesArray = usernames.split(";");
        if (userNamesArray.length > 0) {
            userNamesArray.pop();
        }

        return userNamesArray;
    }
}

class Lobby {
    constructor(result, payload) {
        this.json = JSON.parse(payload);
        this.res = result;
    }

    getResult() {
        return this.res;
    }

    getLobbyId() {
        return this.json.id;
    }

    getOwner() {
        return this.json.owner;
    }

    getName() {
        return this.json.name;
    }

    getIsPrimary() {
        return this.json.isPrimary;
    }

    getMaxUsers() {
        return this.json.maxUsers;
    }
}
class AllRoomsEvent {
    constructor(result, payload) {
        this.json = JSON.parse(payload);
        this.res = result;
    }

    getResult() {
        return this.res;
    }

    getRoomIds() {
        const roomIds = this.json.ids;
        let roomIdsArray = roomIds.split(";");

        if (roomIdsArray.length > 0) {
            roomIdsArray.pop(); // Remove the last empty element
        }

        return roomIdsArray;
    }
}
class Notify {
    constructor(responseBytes, startIndex) {
        this.messageType = responseBytes[startIndex + 0];
        this.updateType = responseBytes[startIndex + 1];
        this.reserved = responseBytes[startIndex + 2];
        this.payLoadType = responseBytes[startIndex + 3];
        this.payLoadSize = bytesToIntger(responseBytes, startIndex + 4);
        this.payLoad = new Uint8Array(this.payLoadSize);
        for (let i = 0; i < this.payLoadSize; i++) {
            this.payLoad[i] = responseBytes[8 + startIndex + i];
        }
    }

    getMessageType() {
        return this.messageType;
    }

    getUpdateType() {
        return this.updateType;
    }

    getPayloadType() {
        return this.payLoadType;
    }

    getPayloadSize() {
        return this.payLoadSize;
    }

    getPayload() {
        return this.payLoad;
    }

    getPayloadString() {
        var array = this.payLoad;
        var str = "";
        for (var i = 0; i < array.length; i++) {
            var char = array[i];
            str += String.fromCharCode(char);
        }
        return str;
    }

    // debug() {
    //     console.log("=========Notify=========");
    //     console.log("messageType : " + AppWarp.MessageType[this.getMessageType()]);
    //     console.log("updateType  : " + AppWarp.UpdateType[this.getUpdateType()]);
    //     console.log("payLoadType : " + AppWarp.PayloadType[this.getPayloadType()]);
    //     console.log("payLoadSize : " + this.getPayloadSize());
    //     console.log("payLoad     : " + this.getPayloadString());
    // }
}
class Room {
    constructor(result, payload) {
        this.json = JSON.parse(payload);
        this.res = result;
    }

    getResult() {
        return this.res;
    }

    getRoomId() {
        return this.json.id;
    }

    getOwner() {
        return this.json.owner;
    }

    getName() {
        return this.json.name;
    }

    getMaxUsers() {
        return this.json.maxUsers;
    }
}
