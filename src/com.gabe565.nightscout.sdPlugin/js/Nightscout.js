let nightscoutMap = {};

class Nightscout {
  constructor({ context, payload: { settings } }) {
    if (nightscoutMap[context]) {
      return nightscoutMap[context];
    }
    this.template = new Template();
    this.context = context;
    this.url = "";
    this.request = { headers: {} };
    this.settings = settings;
    nightscoutMap[context] = this;
  }

  set settings(settings) {
    this._settings = settings;
    if (this.settings.nightscoutUrl) {
      this.url = new URL(this.settings.nightscoutUrl);
      this.url.pathname += "api/v2/properties";
      if (this.settings.token) {
        this.request.headers["Api-Secret"] = this.settings.token;
      }
      this.beginTick();
    }
  }

  get settings() {
    return this._settings;
  }

  async tick() {
    if (!this.url) {
      return;
    }

    try {
      const response = await fetch(this.url, this.request);
      const data = await response.json();
      $SD.setImage(this.context, this.template.render(data));
    } catch (err) {
      console.error(err);
      $SD.showAlert(this.context);
    }
  }

  beginTick() {
    if (!this.url) {
      return;
    }

    this.tick();
    this.stopTick();
    this.tickInterval = setInterval(() => this.tick(), this.settings.updateInterval || 60000);
  }

  stopTick() {
    clearInterval(this.tickInterval);
    this.tickInterval = null;
  }
}
