import IFakeMessageExecutorResponse from './IFakeMessageExecutorResponse';

export default interface IFakeMessageExecutor {
    method: string;
    relativeUrl: string;
    execute: (requestBody: any) => IFakeMessageExecutorResponse;
}