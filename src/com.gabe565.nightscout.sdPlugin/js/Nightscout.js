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
    this.setSettings(settings);
    nightscoutMap[context] = this;
  }

  async setSettings(settings) {
    this.settings = settings;
    if (this.settings.nightscoutUrl) {
      if (this.settings.token) {
        try {
          const buffer = new TextEncoder().encode(this.settings.token);
          const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          this.request.headers["Api-Secret"] = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        } catch (err) {
          console.error(err);
          this.request.headers["Api-Secret"] = this.settings.token;
          $SD.showAlert(this.context);
        }
      }
      this.url = new URL(this.settings.nightscoutUrl);
      this.url.pathname += "api/v2/properties";
      this.beginTick();
    }
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
