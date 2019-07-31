import AbstractCall, {nativeCallBase} from "./abstractCall"

type customParams = {
  [key: string]: string
}
interface nativeCallInviteObject extends nativeCallBase {
  customParameters?: customParams
}

class CallInvite extends AbstractCall {
  private readonly _customParameters: customParams = {}

  private constructor(callInvite: nativeCallInviteObject) {
    super()
    this.updateFromNativeCallObject(callInvite)
    if (callInvite.customParameters !== undefined) {
      this._customParameters = {
        ...this._customParameters,
        ...callInvite.customParameters
      }
    }
  }

  public get customParameters(): customParams {
    return this._customParameters
  }

  // TODO: accept should take an options object
  public accept() {

  }

  public reject() {

  }
}

export default CallInvite
