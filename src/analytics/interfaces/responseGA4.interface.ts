interface DimensionHeader {
    name: string;
  }
  
  interface MetricHeader {
    name: string;
    type: string;
  }
  
  interface DimensionValue {
    value: string;
    oneValue: string;
  }
  
  interface MetricValue {
    value: string;
    oneValue: string;
  }
  
  interface Row {
    dimensionValues: DimensionValue[];
    metricValues: MetricValue[];
  }
  
  interface Metadata {
    samplingMetadatas: any[];
    dataLossFromOtherRow: boolean;
    currencyCode: string;
    _currencyCode: string;
    timeZone: string;
    _timeZone: string;
  }
  
  interface ResponseGA4 {
    dimensionHeaders: DimensionHeader[];
    metricHeaders: MetricHeader[];
    rows: Row[];
    totals: any[];
    maximums: any[];
    minimums: any[];
    rowCount: number;
    metadata: Metadata;
    propertyQuota: any;
    kind: string;
  }
  