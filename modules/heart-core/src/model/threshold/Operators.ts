import { eq, gt, gte, lt, lte } from 'lodash';

import { Thresholdable } from './Thresholdable';

export enum OperatorEnum {
    lte = 'lte',
    gte = 'gte',
    lt = 'lt',
    gt = 'gt',
    eq = 'eq'
}

export type ValidOperatorKeys = keyof typeof OperatorEnum;

type OperatorsType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in keyof typeof OperatorEnum]: (value: any, other: any) => boolean
};

const operators: OperatorsType = {
    lte: lte,
    gte: gte,
    gt: gt,
    lt: lt,
    eq: eq
};

export const compare = (value: Thresholdable, ref: Thresholdable, operator: string): boolean => {
    if ( value === null || value === undefined || ref === undefined || ref === null) {
        return false;
    } else if (!operators[operator]) {
        return false;
    } else {
        return operators[operator](value, ref);
    }
};
