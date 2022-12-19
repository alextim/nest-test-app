export interface StrategyProfile<STRATEGY extends string> {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
  provider: STRATEGY;
}
