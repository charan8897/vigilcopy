const axios = require('axios');
const EventEmitter = require('events');

class FPStream extends EventEmitter {
  constructor(getToken, channelId) {
    super();
    this.getToken = getToken;
    this.channelId = channelId;
    this.baseUrl = `https://flespi.io/gw/channels/${channelId}/messages`;
    this.lastTimestamp = Date.now();
    this.polling = false;
  }

  async poll() {
    try {
      const token = await this.getToken();
      const response = await axios.get(this.baseUrl, {
        headers: {
          Authorization: `FlespiToken ${token}`,
        },
        params: {
          from: this.lastTimestamp,
          limit: 100,
          fields: 'timestamp,ident,message',
          format: 'json',
        },
      });

      if (response.data && response.data.result && response.data.result.length > 0) {
        this.lastTimestamp = response.data.result[response.data.result.length - 1].timestamp + 1;
        response.data.result.forEach((message) => this.emit('update', message));
      }
    } catch (error) {
      throw new Error('Error while streaming !');
    }

    if (this.polling) {
      setTimeout(() => this.poll(), 15000);
    }
  }

  start() {
    if (!this.polling) {
      this.polling = true;
      this.poll();
    }
  }

  stop() {
    this.polling = false;
  }
}

module.exports = FPStream;
