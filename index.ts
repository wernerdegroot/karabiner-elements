type KarabinerModifier = "left_shift" | "right_shift";

type KarabinerKey = {
  key_code: string;
  modifiers?: KarabinerModifier[];
};

const TRUE: 1 = 1;
const FALSE: 0 = 0;

type KarabinerSetVariable = {
  set_variable: {
    name: string;
    value: typeof TRUE | typeof FALSE;
  };
};

type KarabinerTo = KarabinerKey | KarabinerSetVariable;

type KarabinerCondition = {
  name: string;
  type: "variable_if";
  value: typeof TRUE | typeof FALSE;
};

type KarabinerMapping = {
  type: "basic";
  conditions?: KarabinerCondition[];
  from: KarabinerKey;
  to: KarabinerTo[];
  to_if_held_down?: KarabinerTo[];
  to_after_key_up?: KarabinerSetVariable[];
  parameters?: {
    "basic.to_delayed_action_delay_milliseconds": 500;
    "basic.to_if_held_down_threshold_milliseconds": 500;
  };
};

type Mapping = {
  from: string;
  fromModifiers?: KarabinerModifier[];
  to: string;
  toModifiers?: KarabinerModifier[];
};

function mapping(args: Mapping): KarabinerMapping {
  const fromModifiers: Pick<KarabinerKey, "modifiers"> =
    args.fromModifiers == undefined ? {} : { modifiers: args.fromModifiers };

  const toModifiers: Pick<KarabinerKey, "modifiers"> =
    args.toModifiers == undefined ? {} : { modifiers: args.toModifiers };

  return {
    type: "basic",
    from: {
      key_code: args.from,
      ...fromModifiers,
    },
    to: [
      {
        key_code: args.to,
        ...toModifiers,
      },
    ],
  };
}

type LayerName =
  | "upper-layer"
  | "symbol-layer"
  | "navigation-layer"
  | "modifier-layer";

type Layer = {
  from: string;
  fromModifiers?: KarabinerModifier[];
  name: LayerName;
};

function layer(args: Layer): KarabinerMapping {
  const fromModifiers: Pick<KarabinerKey, "modifiers"> =
    args.fromModifiers == undefined ? {} : { modifiers: args.fromModifiers };

  return {
    type: "basic",
    from: {
      key_code: args.from,
      ...fromModifiers,
    },
    to: [
      {
        set_variable: {
          name: args.name,
          value: TRUE,
        },
      },
    ],
    to_after_key_up: [
      {
        set_variable: {
          name: args.name,
          value: FALSE,
        },
      },
    ],
  };
}

type SimplifiedMapping = {
  key: string;
  toModifiers?: KarabinerModifier[];
};

function simple(args: SimplifiedMapping): KarabinerMapping {
  return mapping({
    from: args.key,
    to: args.key,
    toModifiers: args.toModifiers,
  });
}

type DuoMapping = Mapping & {
  layer: LayerName;
};

function duo(args: DuoMapping): KarabinerMapping {
  const fromModifiers: Pick<KarabinerKey, "modifiers"> =
    args.fromModifiers == undefined ? {} : { modifiers: args.fromModifiers };

  const toModifiers: Pick<KarabinerKey, "modifiers"> =
    args.toModifiers == undefined ? {} : { modifiers: args.toModifiers };

  return {
    type: "basic",
    from: {
      key_code: args.from,
      ...fromModifiers,
    },
    to: [
      {
        key_code: args.to,
        ...toModifiers,
      },
    ],
    to_if_held_down: [
      {
        set_variable: {
          name: args.layer,
          value: TRUE,
        },
      },
    ],
    parameters: {
      "basic.to_delayed_action_delay_milliseconds": 500,
      "basic.to_if_held_down_threshold_milliseconds": 500,
    },
    to_after_key_up: [
      {
        set_variable: {
          name: args.layer,
          value: FALSE,
        },
      },
    ],
  };
}

function layerCondition(name: LayerName): Pick<KarabinerMapping, "conditions"> {
  return {
    conditions: [
      {
        name,
        type: "variable_if",
        value: TRUE,
      },
    ],
  };
}

const ifLayer =
  (name: LayerName) =>
  (mapping: KarabinerMapping): KarabinerMapping => {
    return { ...mapping, ...layerCondition(name) };
  };

const baseLayer: KarabinerMapping[] = [
  duo({ from: "tab", to: "tab", layer: "symbol-layer" }),
  simple({ key: "q" }),
  simple({ key: "w" }),
  simple({ key: "e" }),
  simple({ key: "r" }),
  simple({ key: "t" }),
  simple({ key: "y" }),
  simple({ key: "u" }),
  simple({ key: "i" }),
  simple({ key: "o" }),
  simple({ key: "p" }),
  duo({
    from: "open_bracket",
    to: "delete_or_backspace",
    layer: "symbol-layer",
  }),
  layer({ from: "caps_lock", name: "navigation-layer" }),
  simple({ key: "a" }),
  simple({ key: "s" }),
  simple({ key: "d" }),
  simple({ key: "f" }),
  simple({ key: "g" }),
  simple({ key: "h" }),
  simple({ key: "j" }),
  simple({ key: "k" }),
  simple({ key: "l" }),
  duo({ from: "semicolon", to: "return", layer: "modifier-layer" }),
  simple({ key: "z" }),
  simple({ key: "x" }),
  simple({ key: "c" }),
  simple({ key: "v" }),
  simple({ key: "b" }),
  simple({ key: "n" }),
  simple({ key: "m" }),
  simple({ key: "comma" }),
  simple({ key: "period" }),
  duo({ from: "slash", to: "escape", layer: "upper-layer" }),
];

const upperLayer: KarabinerMapping[] = [
  simple({ key: "q", toModifiers: ["right_shift"] }),
  simple({ key: "w", toModifiers: ["right_shift"] }),
  simple({ key: "e", toModifiers: ["right_shift"] }),
  simple({ key: "r", toModifiers: ["right_shift"] }),
  simple({ key: "t", toModifiers: ["right_shift"] }),
  simple({ key: "y", toModifiers: ["left_shift"] }),
  simple({ key: "u", toModifiers: ["left_shift"] }),
  simple({ key: "i", toModifiers: ["left_shift"] }),
  simple({ key: "o", toModifiers: ["left_shift"] }),
  simple({ key: "p", toModifiers: ["left_shift"] }),
  simple({ key: "a", toModifiers: ["right_shift"] }),
  simple({ key: "s", toModifiers: ["right_shift"] }),
  simple({ key: "d", toModifiers: ["right_shift"] }),
  simple({ key: "f", toModifiers: ["right_shift"] }),
  simple({ key: "g", toModifiers: ["right_shift"] }),
  simple({ key: "h", toModifiers: ["left_shift"] }),
  simple({ key: "j", toModifiers: ["left_shift"] }),
  simple({ key: "k", toModifiers: ["left_shift"] }),
  simple({ key: "l", toModifiers: ["left_shift"] }),
  simple({ key: "semicolon", toModifiers: ["left_shift"] }),
  simple({ key: "z", toModifiers: ["right_shift"] }),
  simple({ key: "x", toModifiers: ["right_shift"] }),
  simple({ key: "c", toModifiers: ["right_shift"] }),
  simple({ key: "v", toModifiers: ["right_shift"] }),
  simple({ key: "b", toModifiers: ["right_shift"] }),
  simple({ key: "n", toModifiers: ["left_shift"] }),
  simple({ key: "m", toModifiers: ["left_shift"] }),
  simple({ key: "comma", toModifiers: ["left_shift"] }),
  simple({ key: "period", toModifiers: ["left_shift"] }),
  simple({ key: "slash", toModifiers: ["left_shift"] }),
].map(ifLayer("upper-layer"));

console.log(JSON.stringify([...baseLayer, ...upperLayer], null, 2));
