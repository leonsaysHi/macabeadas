export interface TableField {
  key: string;
  label?: string;
  sortable?: boolean;
  tdClass?: string;
  thClass?: string;
  tfClass?: string;
  sortByFormatted?: boolean;
  formatter?: (value: string, item: unknown, idx: number) => unknown;
}
export interface TableItem<T> {
  [key: string]: T;
}
