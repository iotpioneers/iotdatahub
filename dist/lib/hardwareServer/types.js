"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_NAMES = exports.MESSAGE_TYPES = exports.PROTOCOL = void 0;
// Protocol constants
exports.PROTOCOL = {
    CMD_RESPONSE: 0,
    CMD_PING: 6,
    CMD_HARDWARE: 20,
    CMD_HARDWARE_SYNC: 16,
    CMD_INTERNAL: 17,
    CMD_HW_LOGIN: 29,
    STATUS_SUCCESS: 200,
};
// Message type descriptions
exports.MESSAGE_TYPES = {
    [exports.PROTOCOL.CMD_RESPONSE]: "RESPONSE",
    [exports.PROTOCOL.CMD_PING]: "PING",
    [exports.PROTOCOL.CMD_HARDWARE]: "HARDWARE_COMMAND",
    [exports.PROTOCOL.CMD_HARDWARE_SYNC]: "HARDWARE_SYNC",
    [exports.PROTOCOL.CMD_INTERNAL]: "DEVICE_INFO",
    [exports.PROTOCOL.CMD_HW_LOGIN]: "LOGIN",
};
// Command name mappings
exports.COMMAND_NAMES = {
    vw: "VirtualWrite",
    vr: "VirtualRead",
    dw: "DigitalWrite",
    dr: "DigitalRead",
};
