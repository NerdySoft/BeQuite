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

import android.Manifest;
import android.content.Context;

public class AudioLevelModule extends ReactContextBaseJavaModule {

  private static final String DocumentDirectoryPath = "DocumentDirectoryPath";
  private static final String PicturesDirectoryPath = "PicturesDirectoryPath";
  private static final String MainBundlePath = "MainBundlePath";
  private static final String CachesDirectoryPath = "CachesDirectoryPath";
  private static final String LibraryDirectoryPath = "LibraryDirectoryPath";
  private static final String MusicDirectoryPath = "MusicDirectoryPath";
  private static final String DownloadsDirectoryPath = "DownloadsDirectoryPath";

  private Context context;
  private static MediaRecorder mRecorder = null;
  private static MediaRecorder nRecorder = null;
  private static MediaPlayer mPlayer = null;
  private String currentOutputFile;
  private Timer timer;
  private boolean isRecording = false;
  private int recorderSecondsElapsed;
  private static String nFileName = null;

  public AudioLevelModule(ReactApplicationContext reactContext) {
    super(reactContext);
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
        
        nFileName = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "LastNoiseRecord.3gp";

        //nFileName = getExternalCacheDir().getAbsolutePath();
        //nFileName += "/audiorecordtest.3gp";
        nRecorder = new MediaRecorder();

        nRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        nRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        nRecorder.setOutputFile(nFileName);
        nRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        try {
            nRecorder.prepare();
        } catch (IOException e) {
            //Log.e(LOG_TAG, "prepare() failed");
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
    }
  }

  @ReactMethod
  public void playSong() {
    try {
      //commented temporary. now every time is played will create new instance of MediaPlayer
      //TODO: need to change folder from where to play 
      //if (mPlayer == null) {
          //mPlayer=MediaPlayer.create(this.getReactApplicationContext(), Uri.parse(Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "Alert.mp3"));
          //mPlayer.start();
          
          
          String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "Alert.mp3";
          mPlayer = new  MediaPlayer();
          mPlayer.setDataSource(filePath);
          mPlayer.prepare();   
          mPlayer.start();
      //}
    } catch (Exception e) {
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
      // https://developer.android.com/reference/android/media/MediaRecorder.html#stop()
      //logAndRejectPromise(promise, "RUNTIME_EXCEPTION", "No valid audio data received. You may be using a device that can't record audio.");
      return;
    } finally {
      mRecorder = null;
    }
    //promise.resolve(currentOutputFile);
    sendEvent("recordingFinished", null);
  }
  @ReactMethod
  public void stopRecording() {
    //stopTimer();

    try {
      nRecorder.stop();
      nRecorder.release();
    } catch (final RuntimeException e) {
      // https://developer.android.com/reference/android/media/MediaRecorder.html#stop()
      //logAndRejectPromise(promise, "RUNTIME_EXCEPTION", "No valid audio data received. You may be using a device that can't record audio.");
      return;
    } finally {
      nRecorder = null;
    }
    //promise.resolve(currentOutputFile);
    sendEvent("recordingNoiseFinished", null);
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
