export type KarabinerModifier =
  | "left_shift"
  | "right_shift"
  | "left_control"
  | "right_control"
  | "left_command"
  | "right_command"
  | "any";

export type KarabinerKeyFrom = {
  key_code: string;
  modifiers?: {
    optional?: KarabinerModifier[];
    required?: KarabinerModifier[];
  };
};

export type KarabinerKeyTo = {
  key_code: string;
  modifiers?: KarabinerModifier[];
};

export const TRUE: 1 = 1;
export const FALSE: 0 = 0;

export type KarabinerSetVariable = {
  set_variable: {
    name: string;
    value: typeof TRUE | typeof FALSE;
  };
};

export type KarabinerStickyModifier = {
  [M in KarabinerModifier]: {
    sticky_modifier: {
      [K in M]: "on" | "off" | "toggle";
    };
  };
}[KarabinerModifier];

export type KarabinerTo =
  | KarabinerKeyTo
  | KarabinerSetVariable
  | KarabinerStickyModifier;

export type KarabinerCondition = {
  name: string;
  type: "variable_if";
  value: typeof TRUE | typeof FALSE;
};

export type KarabinerMapping = {
  type: "basic";
  conditions?: KarabinerCondition[];
  parameters?: {
    "basic.to_if_held_down_threshold_milliseconds"?: number;
  },
  from: KarabinerKeyFrom;
  to?: KarabinerTo[];
  to_if_held_down?: KarabinerTo[];
  to_if_alone?: KarabinerTo[];
  to_after_key_up?: KarabinerTo[];
};