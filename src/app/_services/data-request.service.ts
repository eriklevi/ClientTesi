import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {DataRequest} from '../_models/dataRequest';

@Injectable({
  providedIn: 'root'
})
export class DataRequestService {

  private dataRequest = new Subject<DataRequest>();
  private resetChart = new Subject();

  constructor() { }

  updateRequest(request: DataRequest) {
    this.dataRequest.next(request);
  }

  getRequestBehaviourSubject() {
    return this.dataRequest;
  }

  resetChartRequest() {
    this.resetChart.next(true);
  }

  getResetChart() {
    return this.resetChart;
  }
}
