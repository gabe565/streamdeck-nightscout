/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="js/Nightscout.js" />

const nightscoutAction = new Action("com.gabe565.nightscout.action");

nightscoutAction.onDidReceiveSettings(
  (data) => (new Nightscout(data).settings = data.payload.settings),
);

nightscoutAction.onKeyDown((data) => new Nightscout(data).beginTick());

nightscoutAction.onWillDisappear((data) => new Nightscout(data).stopTick());

nightscoutAction.onWillAppear((data) => new Nightscout(data).beginTick());
