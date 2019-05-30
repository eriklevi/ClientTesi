export class DataRequest {
  private _buildingId: string;
  private _roomId: string;
  private _snifferName: string;
  private _fromTimestamp: number;
  private _toTimestamp: number;
  private _resolution: string;
  private _valid: boolean;

  constructor(buildingId: string, roomId: string, snifferName: string, fromTimestamp: number, toTimestamp: number, resolution: string, valid: boolean) {
    this._buildingId = buildingId;
    this._roomId = roomId;
    this._snifferName = snifferName;
    this._fromTimestamp = fromTimestamp;
    this._toTimestamp = toTimestamp;
    this._resolution = resolution;
    this._valid = valid;
  }

  get buildingId(): string {
    return this._buildingId;
  }

  set buildingId(value: string) {
    this._buildingId = value;
  }

  get roomId(): string {
    return this._roomId;
  }

  set roomId(value: string) {
    this._roomId = value;
  }

  get snifferName(): string {
    return this._snifferName;
  }

  set snifferName(value: string) {
    this._snifferName = value;
  }

  get fromTimestamp(): number {
    return this._fromTimestamp;
  }

  set fromTimestamp(value: number) {
    this._fromTimestamp = value;
  }

  get toTimestamp(): number {
    return this._toTimestamp;
  }

  set toTimestamp(value: number) {
    this._toTimestamp = value;
  }

  get resolution(): string {
    return this._resolution;
  }

  set resolution(value: string) {
    this._resolution = value;
  }

  get valid(): boolean {
    return this._valid;
  }

  set valid(value: boolean) {
    this._valid = value;
  }
}
