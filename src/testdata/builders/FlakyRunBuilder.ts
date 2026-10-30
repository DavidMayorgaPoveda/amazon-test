import type { IFlakyRun } from '../../business/types';
import { FlakyRun } from '../../constants/enums';
import flakyRuns from '../datasets/flaky-runs.json';

export class FlakyRunBuilder {
  private scenario: IFlakyRun = { ...flakyRuns[FlakyRun.INTENTIONAL_FIRST_FAILURE] };

  intentionalFirstFailure(): this {
    this.scenario = { ...flakyRuns[FlakyRun.INTENTIONAL_FIRST_FAILURE] };
    return this;
  }

  build(): IFlakyRun {
    return { ...this.scenario };
  }
}
