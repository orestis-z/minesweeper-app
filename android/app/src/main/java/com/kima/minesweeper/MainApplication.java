package com.kima.minesweeper;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.microsoft.codepush.react.CodePush;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.google.android.gms.ads.MobileAds;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new LinearGradientPackage(),
            new RNExitAppPackage(),
            new AsyncStoragePackage(),
          new RNAdMobPackage(),
          new VectorIconsPackage(),
          new OrientationPackage(),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
          new InAppBillingBridgePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    MobileAds.initialize(this, "ca-app-pub-6233263635773218~1366804910");
  }
}
