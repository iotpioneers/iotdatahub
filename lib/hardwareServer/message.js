// Simple Message Parser
class SimpleMessage {
  constructor(type, id, length, body = Buffer.alloc(0)) {
    this.type = type;
    this.id = id;
    this.length = length;
    this.body = body;
    this.timestamp = Date.now();
  }

  static parse(buffer) {
    if (buffer.length < 5) return null;

    const type = buffer.readUInt8(0);
    const id = buffer.readUInt16BE(1);
    const length = buffer.readUInt16BE(3);

    if (buffer.length < 5 + length) return null;

    const body = buffer.slice(5, 5 + length);
    return new SimpleMessage(type, id, length, body);
  }

  toBuffer() {
    const buffer = Buffer.alloc(5 + this.length);
    buffer.writeUInt8(this.type, 0);
    buffer.writeUInt16BE(this.id, 1);
    buffer.writeUInt16BE(this.length, 3);
    if (this.body && this.body.length > 0) {
      this.body.copy(buffer, 5);
    }
    return buffer;
  }
}

module.exports = SimpleMessage;
