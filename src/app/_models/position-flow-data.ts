import {PositionFlowDataPoint} from './position-flow-data-point';

export class PositionFlowData {
  fcs: string;
  minute: number;
  hour: number;
  data: PositionFlowDataPoint[];
}
