import { AdMobInterstitial } from 'react-native-admob';

// config
import * as params from 'src/config/params';

AdMobInterstitial.setAdUnitID(params.adUnitID);
// AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]); // testing

export function showAd() {
  AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
}
