"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveblocks = void 0;
const node_1 = require("@liveblocks/node");
exports.liveblocks = new node_1.Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
});
