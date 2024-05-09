/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="js/Nightscout.js" />

const nightscoutAction = new Action("com.gabe565.nightscout.action");

nightscoutAction.onDidReceiveSettings((data) =>
  new Nightscout(data).setSettings(data.payload.settings),
);

nightscoutAction.onKeyDown((data) => new Nightscout(data).start());

nightscoutAction.onWillDisappear((data) => {
  const ns = new Nightscout(data);
  if (Object.keys(data.payload.settings).length === 0) {
    ns.delete();
  } else {
    ns.stop();
  }
});

nightscoutAction.onWillAppear((data) => new Nightscout(data).start());
