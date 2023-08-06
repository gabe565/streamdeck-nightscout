let nightscoutMap = {};

class Nightscout {
  constructor({ context, payload: { settings } }) {
    if (nightscoutMap[context]) {
      return nightscoutMap[context];
    }
    this.template = new Template();
    this.context = context;
    this.settings = settings;
    nightscoutMap[context] = this;
  }

  set settings(settings) {
    this._settings = settings;
    if (this.settings.nightscoutUrl) {
      this.beginTick();
    }
  }

  get settings() {
    return this._settings;
  }

  async tick() {
    if (!this.settings.nightscoutUrl) {
      return;
    }

    try {
      const url = new URL(this.settings.nightscoutUrl);
      url.pathname += "api/v2/properties";
      const response = await fetch(url);
      const data = await response.json();
      $SD.setImage(this.context, this.template.render(data));
    } catch (err) {
      console.error(err);
      $SD.showAlert(this.context);
    }
  }

  beginTick() {
    if (!this.settings.nightscoutUrl) {
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
