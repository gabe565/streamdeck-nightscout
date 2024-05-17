/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="js/Nightscout.js" />

const nightscoutAction = new Action("com.gabe565.nightscout.action");

nightscoutAction.onDidReceiveSettings(async (data) => {
  const ns = new Nightscout(data);
  await ns.setSettings(data.payload.settings);
  await ns.fetch();
});

nightscoutAction.onKeyDown((data) => new Nightscout(data).fetch());

nightscoutAction.onWillDisappear((data) => {
  const ns = new Nightscout(data);
  if (Object.keys(data.payload.settings).length === 0) {
    ns.delete();
  } else {
    ns.stop();
  }
});

nightscoutAction.onWillAppear((data) => new Nightscout(data).fetch());
