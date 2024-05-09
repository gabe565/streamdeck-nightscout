const Width = 144;
const Height = 144;
const FontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

class Template {
  constructor() {
    this.loaded = new Promise((resolve, reject) => {
      this.img = new Image();
      this.img.onload = () => resolve();
      this.img.onerror = () => reject(new Error("failed to load image"));
      this.img.src = "actions/template/assets/action.svg";
    });

    this.canvas = document.createElement("canvas");
    this.canvas.width = Width;
    this.canvas.height = Height;
  }

  async render(data, settings) {
    await this.loaded;

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, Width, Height);

    const imgWidth = Width / 4;
    const imgHeight = Height / 4;
    context.drawImage(this.img, 10, imgHeight / 2 + 12, imgWidth, imgHeight);

    context.textAlign = "center";
    context.font = `46px ${FontFamily}`;
    let last = data.bgnow.last;
    if (settings.unit === Unit.Mmol) {
      last = NSUtils.toMmol(last);
    }
    if (last >= settings.urgentHigh || last <= settings.urgentLow) {
      context.fillStyle = settings.urgentColor;
    } else if (last >= settings.normalHigh || last <= settings.normalLow) {
      context.fillStyle = settings.normalColor;
    } else {
      context.fillStyle = settings.inRangeColor;
    }
    context.fillText(last, Width / 2 + 20, Height / 2 - 10);

    context.font = `32px ${FontFamily}`;
    let delta = data.delta.display;
    if (settings.unit === Unit.Mmol) {
      delta = NSUtils.toMmol(data.delta.scaled);
      if (delta >= 0) {
        delta = "+" + delta;
      }
    }
    context.fillText(`${data.direction.label}   ${delta}`, Width / 2, Height / 2 + 30);

    context.font = `20px ${FontFamily}`;
    context.fillStyle = "#777";
    const ago = ((Date.now() - data.bgnow.mills) / 1000 / 60) | 0;
    let agoDisplay;
    if (ago > 5) {
      agoDisplay = ago + "m";
    } else {
      agoDisplay = "– ".repeat(ago).trim();
    }
    context.fillText(agoDisplay, Width / 2, Height / 2 + 57);

    return this.canvas.toDataURL();
  }
}
