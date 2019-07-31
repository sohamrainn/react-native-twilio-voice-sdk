import { NativeModules } from 'react-native'
import AbstractCall, {nativeCallBase} from "./abstractCall"

const TwilioVoice = NativeModules.RNTwilioVoiceSDK

type callState = "RINGING" | "CONNECTING" | "CONNECTED" | "RECONNECTING" | "DISCONNECTED"

export interface nativeCallObject extends nativeCallBase {
  state: callState,
  error?: {
    code?: number,
    domain?: string,
    message?: string,
    reason?: string,
  }
}

class Call extends AbstractCall {
  // @ts-ignore
  private _state: callState
  private _isMuted: boolean = false
  private _onSpeaker: boolean = false

  // The constructor is meant to be called only from the Device class
  // when making a connect, or receiving an incoming
  private constructor(call: nativeCallObject) {
    super()
    this.updateFromNative(call)
  }

  public get state(): callState {
    return this._state
  }

  public get isMuted(): boolean {
    return this._isMuted
  }

  public get onSpeaker(): boolean {
    return this._onSpeaker
  }

  public disconnect = () => {
    TwilioVoice.disconnect()
  }

  public mute = (value: boolean) => {
    TwilioVoice.setMuted(value)
    this._isMuted = value
  }

  public setSpeakerPhone = (value: boolean) => {
    TwilioVoice.setSpeakerPhone(value)
    this._onSpeaker = value
  }

  public sendDigits = (digits: string) => {
    TwilioVoice.sendDigits(digits)
  }

  public refresh = (): Promise<Call> => {
    return TwilioVoice.getActiveCall()
      .then((call: nativeCallObject) => {
        this.updateFromNative(call)
        return Promise.resolve(this)
      }).catch((err: Error) => {
        // err should be that there is no call, therefore
        // the status is set to DISCONNECTED
        console.log(err.message)
        this._state = "DISCONNECTED"
        return Promise.resolve(this)
      })
  }

  private updateFromNative = (call: nativeCallObject) => {
    this.updateFromNativeCallObject(call)
    this._state = call.state
  }

}

export default Call
