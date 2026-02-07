/**
 * CallScreen: Full-screen Jitsi Meet via WebView.
 * - Loads meet.jit.si/<roomId> with config (display name, mic/cam on, minimal UI).
 * - Lifecycle: onCallStart, onCallEnd (navigate back + optional POST /call/end).
 * - Floating exit button, back button handling, loading and error states.
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/ui/Text';
import { colors } from '../../theme/colors';
import { endCall } from '../../service/callApi';

const JITSI_BASE = 'https://meet.jit.si';
const MEETING_LOAD_TIMEOUT_MS = 25000;

/**
 * Build Jitsi Meet URL with hash config for display name, mic/cam on, and reduced UI.
 */
const buildJitsiUrl = (roomId, displayName) => {
  const encodedName = encodeURIComponent(displayName || 'Guest');
  const params = [
    'config.startWithAudioMuted=false',
    'config.startWithVideoMuted=false',
    'config.prejoinPageEnabled=false',
    'config.disableDeepLinking=true',
    'userInfo.displayName=' + encodedName,
  ].join('&');
  return `${JITSI_BASE}/${encodeURIComponent(roomId)}#${params}`;
};

/**
 * Injected script: optional hangup detection.
 * Jitsi Meet DOM may vary; we rely on Exit button and BackHandler as primary.
 */
const INJECTED_SCRIPT = `
  (function() {
    function notifyEnd() {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CALL_END' }));
      }
    }
    setTimeout(function() {
      var leaveBtn = document.querySelector('[aria-label="Leave meeting"]');
      if (leaveBtn) leaveBtn.addEventListener('click', notifyEnd);
    }, 5000);
  })();
  true;
`;

const CallScreen = ({ route, navigation }) => {
  const { roomId, displayName, role } = route.params || {};
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const callStartTimeRef = useRef(null);
  const hasEndedRef = useRef(false);

  const handleCallEnd = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    const duration = callStartTimeRef.current
      ? Math.round((Date.now() - callStartTimeRef.current) / 1000)
      : 0;
    endCall({
      room_id: roomId,
      duration,
      user_id: undefined, // Optional: pass from auth context
    }).catch(() => {});
    navigation.goBack();
  }, [roomId, navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleCallEnd();
      return true;
    });
    return () => sub.remove();
  }, [handleCallEnd]);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      const camera = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
      const mic = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
      if (!camera || !mic) {
        setError('Camera and microphone are required for the call.');
      }
    } catch (e) {
      setError('Could not request permissions.');
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Meeting is taking too long to load. Check your connection and try again.');
      }
    }, MEETING_LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [loading]);

  const onLoadStart = () => {
    setError(null);
    setLoading(true);
  };

  const onLoadEnd = () => {
    setLoading(false);
    callStartTimeRef.current = Date.now();
  };

  const onError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    setError(nativeEvent.description || 'Failed to load meeting. Check your internet connection.');
  };

  const onHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    setError(`Connection error (${nativeEvent.statusCode}). Please try again.`);
  };

  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'CALL_END') handleCallEnd();
    } catch (_) {}
  };

  if (!roomId) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text variant="body" style={styles.errorText}>Missing room ID.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.exitButton}>
            <Text variant="body" style={styles.exitButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const jitsiUrl = buildJitsiUrl(roomId, displayName);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        mediaCapture="grant"
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onError={onError}
        onHttpError={onHttpError}
        injectedJavaScript={INJECTED_SCRIPT}
        onMessage={onMessage}
        originWhitelist={['https://*', 'http://*']}
        mixedContentMode="compatibility"
      />
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" style={styles.loadingText}>Joining meeting…</Text>
        </View>
      )}
      {error && !loading && (
        <View style={styles.errorOverlay}>
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <Text variant="body" style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleCallEnd} style={styles.exitButton}>
            <Text variant="body" style={styles.exitButtonText}>Exit call</Text>
          </TouchableOpacity>
        </View>
      )}
      <SafeAreaView style={styles.floatingExit} edges={['top']}>
        <TouchableOpacity
          onPress={handleCallEnd}
          style={styles.exitFab}
          activeOpacity={0.8}
        >
          <Icon name="phone-hangup" size={28} color={colors.white} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    marginTop: 12,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
    marginTop: 16,
  },
  exitButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  exitButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  floatingExit: {
    position: 'absolute',
    top: 0,
    right: 16,
    alignItems: 'flex-end',
  },
  exitFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default CallScreen;
