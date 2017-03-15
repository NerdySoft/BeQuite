package com.pepperoniapptemplate.audiolevel;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.HashMap;

import java.io.File;
import java.io.IOException;

import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.content.Intent;
import 	android.net.Uri;
import android.app.Activity;


import android.Manifest;
import android.content.Context;
import com.pepperoniapptemplate.R;

public class AudioLevelModule extends ReactContextBaseJavaModule {

  private static final String DocumentDirectoryPath = "DocumentDirectoryPath";
  private static final String PicturesDirectoryPath = "PicturesDirectoryPath";
  private static final String MainBundlePath = "MainBundlePath";
  private static final String CachesDirectoryPath = "CachesDirectoryPath";
  private static final String LibraryDirectoryPath = "LibraryDirectoryPath";
  private static final String MusicDirectoryPath = "MusicDirectoryPath";
  private static final String DownloadsDirectoryPath = "DownloadsDirectoryPath";

  private Context context;
  private static MediaRecorder mRecorder = null;//recorder to listen loud level without saving it
  private static MediaRecorder nRecorder = null;//recorder to save audio into file
  private static MediaPlayer mPlayer = null;//audio player
  private Timer timer;
  private boolean isRecording = false;//not using it (yet)
  private int recorderSecondsElapsed;//not using it (yet)
  private static String nFileName = null;//record file name.


  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
          if(requestCode == 1){
            if(resultCode == Activity.RESULT_OK){
              Uri uri = intent.getData();
              String path = uri.getPath();
              WritableMap body = Arguments.createMap();
              body.putString("fileURI", uri.toString());
              sendEvent("chosenFleURI", body);
            }
          }
        }
  };
  


  public AudioLevelModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public Map<String, Object> getConstants() {
    Map<String, Object> constants = new HashMap<>();
    constants.put(DocumentDirectoryPath, this.getReactApplicationContext().getFilesDir().getAbsolutePath());
    constants.put(PicturesDirectoryPath,
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getAbsolutePath());
    constants.put(MainBundlePath, "");
    constants.put(CachesDirectoryPath, this.getReactApplicationContext().getCacheDir().getAbsolutePath());
    constants.put(LibraryDirectoryPath, "");
    constants.put(MusicDirectoryPath,
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC).getAbsolutePath());
    constants.put(DownloadsDirectoryPath,
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());
    return constants;
  }

  @Override
  public String getName() {
    return "AudioLevel";
  }

  //maybe we will need this later?
  @ReactMethod
  public void checkAuthorizationStatus(Promise promise) {
    int permissionCheck = ContextCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.RECORD_AUDIO);
    boolean permissionGranted = permissionCheck == PackageManager.PERMISSION_GRANTED;
    promise.resolve(permissionGranted);
  }

  @ReactMethod
private void startRecording() {
        //TODO: need to save file somewere else.
        //TODO: if there is no directory file will not save and error will be thrown :(
        nFileName = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "LastNoiseRecord.3gp";
        nRecorder = new MediaRecorder();

        nRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        nRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        nRecorder.setOutputFile(nFileName);
        nRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        try {
            nRecorder.prepare();
        } catch (IOException e) {
          WritableMap body = Arguments.createMap();
          body.putString("error", "Error in startRecording(): " + e.getMessage());
          sendEvent("logger", body);
        }

        nRecorder.start();
        sendEvent("recordingNoiseStart", null);
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
        stopTimer();
        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
          @Override
          public void run() {
            WritableMap body = Arguments.createMap();
            body.putInt("currentAmp", mRecorder.getMaxAmplitude());
            sendEvent("recordingProgress", body);
          }
        }, 0, 500);
      }
    } catch (Exception e) {
      WritableMap body = Arguments.createMap();
      body.putString("error", "Error in start(): " + e.getMessage());
      sendEvent("logger", body);
    }
  }

  @ReactMethod
  public void playSong(String songPath) {
    //commented temporary. now every time is played will create new instance of MediaPlayer
      //TODO: need to change folder from where to play 
    try {
      if(TextUtils.isEmpty(songPath)){
        MediaPlayer alert= MediaPlayer.create(this.getReactApplicationContext() ,R.raw.alert);
          alert.start();
      }else{
        //if (mPlayer == null) {
          //going to change it to use android URI
          //String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "sound.mp3";
          mPlayer = new  MediaPlayer();
          //mPlayer.setDataSource(filePath);
          mPlayer.setDataSource(this.getReactApplicationContext(),  Uri.parse(songPath));
          mPlayer.prepare();   
          mPlayer.start();
      //}
      }
      
      
    } catch (Exception e) {
              WritableMap body = Arguments.createMap();
              body.putString("error", e.getMessage());
              sendEvent("logger", body);
    }
  }

  private void stopTimer() {
    //recorderSecondsElapsed = 0;
    if (timer != null) {
      timer.cancel();
      timer.purge();
      timer = null;
    }
  }

  @ReactMethod
  public void stop() {
    stopTimer();
    try {
      mRecorder.stop();
      mRecorder.release();
    } catch (final RuntimeException e) {
      WritableMap body = Arguments.createMap();
      body.putString("error", "Error in stop(): " + e.getMessage());
      sendEvent("logger", body);
      return;
    } finally {
      mRecorder = null;
    }
    sendEvent("recordingFinished", null);
  }
  @ReactMethod
  public void stopRecording() {
    //stopTimer();

    try {
      nRecorder.stop();
      nRecorder.release();
    } catch (final RuntimeException e) {
      WritableMap body = Arguments.createMap();
      body.putString("error", "Error in stopRecording(): " + e.getMessage());
      sendEvent("logger", body);
      return;
    } finally {
      nRecorder = null;
    }
    sendEvent("recordingNoiseFinished", null);
  }

  @ReactMethod
  public void chooseAudio() {
    Activity activity = getCurrentActivity();
    Intent intent_upload = new Intent();
    intent_upload.setType("audio/*");
    intent_upload.setAction(Intent.ACTION_GET_CONTENT);
    activity.startActivityForResult(intent_upload,1);
  }
  private void sendEvent(String eventName, Object params) {
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
        params);
  }

  private void logAndRejectPromise(Promise promise, String errorCode, String errorMessage) {
    //Log.e(TAG, errorMessage);
    promise.reject(errorCode, errorMessage);
  }
}
