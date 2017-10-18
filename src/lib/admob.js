import { AdMobInterstitial } from 'react-native-admob';

AdMobInterstitial.setAdUnitID('ca-app-pub-6233263635773218/5354151389');
AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);

export function showAd() {
  AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
}
