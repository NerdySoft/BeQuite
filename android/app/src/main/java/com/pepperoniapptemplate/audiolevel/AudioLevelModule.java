package com.pepperoniapptemplate.audiolevel;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
// these classes are required for playing the audio
import java.io.File;
import java.io.IOException;

import android.media.MediaPlayer;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.os.Environment;

public class AudioLevelModule extends ReactContextBaseJavaModule {

    private static MediaRecorder mRecorder = null;
    private Timer timer;
    public AudioLevelModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AudioLevel";
    }
/*    @ReactMethod
    public void preparePlayer(String url) {
        try{
            if (mediaPlayer != null) {
                mediaPlayer.release();
                mediaPlayer = null;
            }
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mediaPlayer.setDataSource(url);
            mediaPlayer.setLooping(true);
            mediaPlayer.prepareAsync();
        }catch(Exception e){  }
    }

    @ReactMethod
    public void play() {
        try{
            if (mediaPlayer != null) {
                if (!mediaPlayer.isPlaying()) {
                    mediaPlayer.start();
                }
            }
        }catch(Exception e){}
    }*/

    private void sendEvent(String eventName, Object params) {
    getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @ReactMethod
    public void isEqual(
            int a,
            int b,
            Callback booleanCallback) {
        boolean equal = a == b;
        booleanCallback.invoke(equal);
    }




    @ReactMethod
    public void start() {
        try {
            if (mRecorder == null) {
                mRecorder = new MediaRecorder();
                mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                mRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
                mRecorder.setOutputFile("/dev/null");
                mRecorder.prepare();
                mRecorder.start();
                timer = new Timer();
                timer.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                  WritableMap body = Arguments.createMap();
                  body.putInt("currentAmp", mRecorder.getMaxAmplitude());
                  sendEvent("recordingProgress", body);
                }
              }, 0, 1000);
            }
        }catch(Exception e){}
    }

    @ReactMethod
    public void stop() {
        if (mRecorder != null) {
            mRecorder.stop();
            mRecorder.release();
            mRecorder = null;
        }
    }

    /*@ReactMethod
    private void sendEvent(ReactContext reactContext,
                       String eventName,
                       @Nullable WritableMap params) {
                         reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
    }*/

    @ReactMethod
    public void getAmplitude(Callback amplitudeCallback) {
        if (mRecorder != null) {
            amplitudeCallback.invoke(mRecorder.getMaxAmplitude());
            //amplitudeCallback.invoke("azazazaza");
        }
        else
            amplitudeCallback.invoke("catch");

    }
/*    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }*/

/*    @ReactMethod
    public void getAmplitudeViaEvent() {
        WritableMap event = Arguments.createMap();
        event.putString("message", "MyMessage");
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getJSModule(RCTEventEmitter.class).
                receiveEvent(getId("topChange",event));

        *//*int countdown = 0;
        while (countdown < 1000){
            if (mRecorder != null) {
                //amplitudeCallback.invoke(mRecorder.getMaxAmplitude());
                //amplitudeCallback.invoke("azazazaza");
                sendEvent(reactContext, "getAmplitude", mRecorder.getMaxAmplitude());
            }
            else{
                sendEvent(reactContext, "getAmplitude", "error");
            }
            ++countdown;
            Thread.sleep(500);
        }*//*
    }*/


}
