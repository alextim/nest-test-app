export enum SchedulerType {
  Daily = 'daily',
  Interval = 'interval',
  Custom = 'custom',
}

export enum IntervalType {
  Minute = 'minute',
  Hour = 'hour',
}

export type DailyWeekdays = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
];
