export type nativeCallBase = {
  sid?: string,
  to?: string,
  from?: string,
}

abstract class AbstractCall {
  private _to: string | undefined;
  private _from: string | undefined;
  private _sid: string | undefined;

  public get to(): string | undefined {
    return this._to
  }

  public get from(): string | undefined {
    return this._from
  }

  public get sid(): string | undefined {
    return this._sid
  }

  protected updateFromNativeCallObject = (call: nativeCallBase) => {
    if (call.sid !== undefined) {
      this._sid = call.sid
    }
    if (call.from !== undefined) {
      this._from = call.from
    }
    if (call.to !== undefined) {
      this._to = call.to
    }
  }

}

export default AbstractCall
