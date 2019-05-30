import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {DataRequest} from '../_models/dataRequest';
import {TrackDataRequest} from '../_models/track-data-request';

@Injectable({
  providedIn: 'root'
})
export class DataRequestService {

  private dataRequest = new Subject<DataRequest>();
  private resetChart = new Subject();
  private trackDataRequest = new Subject<TrackDataRequest>();

  constructor() { }

  updateRequest(request: DataRequest) {
    this.dataRequest.next(request);
  }

  getDataRequestSubject() {
    return this.dataRequest;
  }

  resetChartRequest() {
    this.resetChart.next(true);
  }

  getResetChart() {
    return this.resetChart;
  }

  updateTrackRequest(request: TrackDataRequest) {
    this.trackDataRequest.next(request);
  }

  getTrackrequestSubject() {
    return this.trackDataRequest;
  }
}
