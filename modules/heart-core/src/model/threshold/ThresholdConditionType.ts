import { OperatorEnum } from './Operators';
import { Thresholdable } from './Thresholdable';

export type ThresholdConditionType = {
    [key in OperatorEnum]?: Thresholdable;
};
