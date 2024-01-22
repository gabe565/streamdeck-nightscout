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

  render(data, unit) {
    if (!this.loaded) {
      return;
    }

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, Width, Height);

    const imgWidth = Width / 4;
    const imgHeight = Height / 4;
    context.drawImage(this.img, 10, Height / 2 - imgHeight / 2, imgWidth, imgHeight);

    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "36px Verdana";
    let last = data.bgnow.last;
    if (unit === Unit.Mmol) {
      last = Math.round(last * ConversionFactor * 10) / 10;
    }
    context.fillText(last, Width / 2 + 20, Height / 2);

    context.font = "26px Verdana";
    let delta = data.delta.display;
    if (unit === Unit.Mmol) {
      delta = Math.round(data.delta.scaled * ConversionFactor * 10) / 10;
      if (delta >= 0) {
        delta = "+" + delta;
      }
    }
    context.fillText(`${data.direction.label} ${delta}`, Width / 2 + 20, Height / 2 + 30);

    return this.canvas.toDataURL();
  }

  setData(data) {
    // stub
  }
}
