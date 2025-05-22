export interface TableMethodJsonModel {
  prediction: {
    variable_name: string;
    predicted_value: string;
    probability: number;
  };
  supporting_factors: {
    feature: string;
    value: string;
    importance?: string;
  }[];
  opposing_factors: {
    feature: string;
    value: string;
    importance?: string;
  }[];
  immediate_causes: {
    feature: string;
    increase_percent: number;
    state: string;
  }[];
  level3_explanations: {
    query: string;
    supporting: {
      feature: string;
      value: string;
      importance?: string;
    }[];
    opposing: {
      feature: string;
      value: string;
      importance?: string;
    }[];
    partially_supporting: {
      feature: string;
      value: string;
      importance?: string;
    }[];
  }[];
  explanation_level: string;
}
