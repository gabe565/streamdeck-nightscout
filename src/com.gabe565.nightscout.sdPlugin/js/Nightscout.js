const nightscoutMap = {};

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
    this.settings = { ...DefaultSettings, ...settings };
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
      this.url.pathname += "api/v2/properties/bgnow,buckets,delta,direction";
    }
  }

  async fetch() {
    clearTimeout(this.fetchTimeout);
    this.fetchTimeout = null;

    if (!this.url) {
      return;
    }

    let sleepMs = 60000;
    try {
      const response = await fetch(this.url, this.request);
      this.response = await response.json();
      await this.render();

      const bucket = this.response?.buckets?.[0];
      if (bucket) {
        const lastDiff = bucket.toMills - bucket.fromMills;
        const nextRead = this.response?.bgnow?.mills + lastDiff + 30000;
        const now = Date.now();
        if (nextRead - now > 0) {
          sleepMs = nextRead - now;
        }
      }
    } catch (err) {
      console.error(err);
      $SD.showAlert(this.context);
    }

    if (!this.fetchTimeout) {
      this.fetchTimeout = setTimeout(() => this.fetch(), sleepMs);
    }
  }

  async render() {
    clearTimeout(this.renderTimeout);
    this.renderTimeout = null;

    if (!this.response) {
      $SD.setImage(this.context);
      return;
    }

    try {
      const image = await this.template.render(this.response, this.settings);
      if (image) {
        $SD.setImage(this.context, image);

        let sleepMs = 60000;
        const mills = this.response.bgnow?.mills;
        if (mills) {
          let diff = (Date.now() - mills) % 60000;
          sleepMs = 60000 - diff;
        }

        if (!this.renderTimeout) {
          this.renderTimeout = setTimeout(() => this.render(), sleepMs);
        }
      }
    } catch (err) {
      console.error(err);
      $SD.showAlert(this.context);
      $SD.setImage(this.context);
    }
  }

  stop() {
    clearTimeout(this.fetchTimeout);
    this.fetchTimeout = null;
    clearTimeout(this.renderTimeout);
    this.renderTimeout = null;
  }

  delete() {
    this.stop();
    delete nightscoutMap[this.context];
  }
}
