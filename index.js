import {
    NativeModules,
    NativeEventEmitter,
} from 'react-native'
import {version} from './package.json';

const TwilioVoice = NativeModules.RNTwilioVoiceSDK

const NativeAppEventEmitter = new NativeEventEmitter(TwilioVoice)

const _eventHandlers = {
    connected: new Map(),
    connectFailure: new Map(),
    reconnecting: new Map(),
    reconnected: new Map(),
    disconnected: new Map(),
    ringing: new Map(),
}

let nativeVersion;

const Twilio = {
    getVersion() {
      return version
    },
    getNativeVersion() {
        if(nativeVersion) {
          return Promise.resolve(nativeVersion)
        }
        return new Promise(resolve =>
           TwilioVoice.getVersion()
             .then(v => {
                 nativeVersion = v
                 resolve(v)
             })
        )
    },
    connect(accessToken, options = {}) {
        TwilioVoice.connect(accessToken, options)
    },
    disconnect() {
        TwilioVoice.disconnect()
    },
    setMuted(isMuted) {
        TwilioVoice.setMuted(isMuted)
    },
    setSpeakerPhone(value) {
        TwilioVoice.setSpeakerPhone(value)
    },
    sendDigits(digits) {
        TwilioVoice.sendDigits(digits)
    },

    getActiveCall() {
        return TwilioVoice.getActiveCall()
    },
    addEventListener(type, handler) {
        if (_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].set(handler, NativeAppEventEmitter.addListener(type, rtn => { handler(rtn) }))
    },
    removeEventListener(type, handler) {
        if (!_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].get(handler).remove()
        _eventHandlers[type].delete(handler)
    }
}

export default Twilio
