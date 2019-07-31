import AbstractCall, { nativeCallBase } from "./abstractCall"

class CancelledCallInvite extends AbstractCall {
  private constructor(call: nativeCallBase) {
    super()
    this.updateFromNativeCallObject(call)
  }
}

export default CancelledCallInvite
