import {
  CancelResponse,
  ContinueResponse,
  ParametersGatherer
} from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import {
  LocalComponent,
  RetrieveDescriber
} from '../forceSourceRetrieveMetadata';

export class SimpleGatherer<T> implements ParametersGatherer<T> {
  private input: T;

  constructor(input: T) {
    this.input = input;
  }

  public async gather(): Promise<ContinueResponse<T>> {
    return {
      type: 'CONTINUE',
      data: this.input
    };
  }
}

export class RetrieveComponentOutputGatherer
  implements ParametersGatherer<LocalComponent[]> {
  private describer: RetrieveDescriber;

  constructor(describer: RetrieveDescriber) {
    this.describer = describer;
  }

  public async gather(): Promise<
    CancelResponse | ContinueResponse<LocalComponent[]>
  > {
    return {
      type: 'CONTINUE',
      data: await this.describer.gatherOutputLocations()
    };
  }
}
