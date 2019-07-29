import {
    NativeModules,
    NativeEventEmitter, EmitterSubscription,
} from 'react-native'

const version = require('../package.json').version;

const TwilioVoice = NativeModules.RNTwilioVoiceSDK

const NativeAppEventEmitter = new NativeEventEmitter(TwilioVoice)

type handlerFn = (...args: any[]) => void
type validEvents = "connected" | "connectFailure" | "reconnecting" | "reconnected" | "disconnected" | "ringing"
type eventHandlers = {
    [key in validEvents]: Map<handlerFn, EmitterSubscription>
}
const _eventHandlers: eventHandlers  = {
    connected: new Map(),
    connectFailure: new Map(),
    reconnecting: new Map(),
    reconnected: new Map(),
    disconnected: new Map(),
    ringing: new Map(),
}

let nativeVersion: string;

const Twilio = {
    getVersion(): string {
      return version
    },
    getNativeVersion(): Promise<string> {
        if(nativeVersion) {
          return Promise.resolve(nativeVersion)
        }
        return new Promise(resolve =>
           TwilioVoice.getVersion()
             .then((v: string) => {
                 nativeVersion = v
                 resolve(v)
             })
        )
    },
    connect(accessToken: string, options = {}) {
        TwilioVoice.connect(accessToken, options)
    },
    disconnect() {
        TwilioVoice.disconnect()
    },
    setMuted(isMuted: boolean) {
        TwilioVoice.setMuted(isMuted)
    },
    setSpeakerPhone(value: boolean) {
        TwilioVoice.setSpeakerPhone(value)
    },
    sendDigits(digits: string) {
        TwilioVoice.sendDigits(digits)
    },

    getActiveCall() {
        return TwilioVoice.getActiveCall()
    },
    addEventListener(type: validEvents, handler: handlerFn) {
        if (_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].set(handler, NativeAppEventEmitter.addListener(type, rtn => { handler(rtn) }))
    },
    removeEventListener(type: validEvents, handler: handlerFn) {
        if (!_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].get(handler)!.remove()
        _eventHandlers[type].delete(handler)
    }
}

export default Twilio
