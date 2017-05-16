package com.smallthngs.cordova;

import android.util.Log;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;

public class AppUpdate extends CordovaPlugin {

@Override
public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if (action.equals("setReadable")) {
        String url = args.getString(0);
        this.setReadable(url, callbackContext);
        return true;
    }
    return false;
}

private void setReadable(String url, CallbackContext callbackContext) {
    File file = null;
    try {
        file = new File(new URI(url));
    } catch (URISyntaxException e) {
        e.printStackTrace();
        callbackContext.error("Invalid URI");
    }

    if (file.setReadable(true, false)) {
        callbackContext.success();
    } else {
        callbackContext.error("Could not change read permissions");
    }
}
}