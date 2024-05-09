const Width = 144;
const Height = 144;

class Template {
  constructor() {
    this.loaded = true;

    this.canvas = document.createElement("canvas");
    this.canvas.width = Width;
    this.canvas.height = Height;

    this.img = new Image();
    this.img.onload = () => (this.loaded = true);
    this.img.src = "actions/template/assets/action.svg";
  }

  render(data, settings) {
    if (!this.loaded) {
      return;
    }

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, Width, Height);

    const imgWidth = Width / 4;
    const imgHeight = Height / 4;
    context.drawImage(this.img, 10, Height / 2 - imgHeight / 2, imgWidth, imgHeight);

    context.textAlign = "center";
    context.font = "36px Verdana";
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

    context.font = "25px Verdana";
    let delta = data.delta.display;
    if (settings.unit === Unit.Mmol) {
      delta = NSUtils.toMmol(data.delta.scaled);
      if (delta >= 0) {
        delta = "+" + delta;
      }
    }
    context.fillText(`${data.direction.label} ${delta}`, Width / 2 + 20, Height / 2 + 20);

    context.font = "22px Verdana";
    context.fillStyle = "#777";
    const ago = ((Date.now() - data.bgnow.mills) / 1000 / 60) | 0;
    let agoDisplay;
    if (ago > 5) {
      agoDisplay = ago + "m";
    } else {
      agoDisplay = "–".repeat(ago);
    }
    context.fillText(agoDisplay, Width / 2 + 20, Height / 2 + 50);

    return this.canvas.toDataURL();
  }

  setData(data) {
    // stub
  }
}
