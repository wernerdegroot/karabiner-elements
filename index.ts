type KarabinerModifier =
  | "left_shift"
  | "right_shift"
  | "left_control"
  | "right_control"
  | "left_command"
  | "right_command"
  | "any";

type KarabinerKeyFrom = {
  key_code: string;
  modifiers?: {
    optional?: KarabinerModifier[];
    required?: KarabinerModifier[];
  };
};

type KarabinerKeyTo = {
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

type KarabinerStickyModifier = {
  [M in KarabinerModifier]: {
    sticky_modifier: {
      [K in M]: "on" | "off" | "toggle";
    };
  };
}[KarabinerModifier];

type KarabinerTo =
  | KarabinerKeyTo
  | KarabinerSetVariable
  | KarabinerStickyModifier;

type KarabinerCondition = {
  name: string;
  type: "variable_if";
  value: typeof TRUE | typeof FALSE;
};

type KarabinerMapping = {
  type: "basic";
  conditions?: KarabinerCondition[];
  from: KarabinerKeyFrom;
  to: KarabinerTo[];
  to_if_alone?: KarabinerTo[];
  to_after_key_up?: KarabinerTo[];
};

type Mapping = {
  from: string;
  fromModifiers?: KarabinerModifier[];
  to: string;
  toModifiers?: KarabinerModifier[];
};

function mapping(args: Mapping): KarabinerMapping {
  const fromModifiers: Pick<KarabinerKeyFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.required = args.fromModifiers;
  }

  const toModifiers: Pick<KarabinerKeyTo, "modifiers"> =
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
  const fromModifiers: Pick<KarabinerKeyFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.required = args.fromModifiers;
  }

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
  const fromModifiers: Pick<KarabinerKeyFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.required = args.fromModifiers;
  }

  const toModifiers: Pick<KarabinerKeyTo, "modifiers"> =
    args.toModifiers == undefined ? {} : { modifiers: args.toModifiers };

  return {
    type: "basic",
    from: {
      key_code: args.from,
      ...fromModifiers,
    },
    to_if_alone: [
      {
        key_code: args.to,
        ...toModifiers,
      },
    ],
    to: [
      {
        set_variable: {
          name: args.layer,
          value: TRUE,
        },
      },
    ],
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
    return { ...layerCondition(name), ...mapping };
  };

const tab: KarabinerMapping = {
  type: "basic",
  from: {
    key_code: "tab",
    modifiers: {
      optional: ["any"],
    },
  },
  to: [
    {
      set_variable: {
        name: "symbol-layer-left",
        value: TRUE,
      },
    },
  ],
  to_after_key_up: [
    {
      set_variable: {
        name: "symbol-layer-left",
        value: FALSE,
      },
    },
    {
      sticky_modifier: {
        left_command: "off",
      },
    },
  ],
  to_if_alone: [
    {
      key_code: "tab",
    },
  ],
};

// == Base layer =================================
// TAB  q   w   e   r   t   y   u   i   o   p  BSP
// ___  a   s   d   f   g   h   j   k   l  RET
// ___  z   x   c   v   b   n   m   ,   .  ESC
const baseLayer: KarabinerMapping[] = [
  tab,
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
  layer({ from: "left_shift", name: "upper-layer" }),
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

// == Upper layer ================================
// ___  Q   W   E   R   T   Y   U   I   O   P  DEL
// ___  A   S   D   F   G   H   J   K   L  ___
// ___  Z   X   C   V   B   N   M   ;   :  ___
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
  mapping({ from: "delete_or_backspace", to: "delete_forward" }),
  simple({ key: "a", toModifiers: ["right_shift"] }),
  simple({ key: "s", toModifiers: ["right_shift"] }),
  simple({ key: "d", toModifiers: ["right_shift"] }),
  simple({ key: "f", toModifiers: ["right_shift"] }),
  simple({ key: "g", toModifiers: ["right_shift"] }),
  simple({ key: "h", toModifiers: ["left_shift"] }),
  simple({ key: "j", toModifiers: ["left_shift"] }),
  simple({ key: "k", toModifiers: ["left_shift"] }),
  simple({ key: "l", toModifiers: ["left_shift"] }),
  simple({ key: "z", toModifiers: ["right_shift"] }),
  simple({ key: "x", toModifiers: ["right_shift"] }),
  simple({ key: "c", toModifiers: ["right_shift"] }),
  simple({ key: "v", toModifiers: ["right_shift"] }),
  simple({ key: "b", toModifiers: ["right_shift"] }),
  simple({ key: "n", toModifiers: ["left_shift"] }),
  simple({ key: "m", toModifiers: ["left_shift"] }),
  mapping({ from: "comma", to: "semicolon" }),
  mapping({ from: "period", to: "semicolon", toModifiers: ["left_shift"] }),
  simple({ key: "slash", toModifiers: ["left_shift"] }),
].map(ifLayer("upper-layer"));

const symbolR: 

// == Symbol layer ===============================
// ___  "   <   >   '   %   ~   &   (   )   _  DEL
// ___  !   -   +   =   #   `   |   {   }   ?
// ___  ^   /   *   \  EUR  @  EMO  [   ]   $
const symbolLayer: KarabinerMapping[] = [
  mapping({ from: "q", to: "quote", toModifiers: ["left_shift"] }),
  mapping({ from: "w", to: "comma", toModifiers: ["left_shift"] }),
  mapping({ from: "e", to: "period", toModifiers: ["left_shift"] }),
  mapping({ from: "r", to: "quote" }),
  mapping({ from: "t", to: "5", toModifiers: ["left_shift"] }),
  mapping({
    from: "y",
    to: "grave_accent_and_tilde",
    toModifiers: ["right_shift"],
  }),
  mapping({ from: "u", to: "7", toModifiers: ["left_shift"] }),
  mapping({ from: "i", to: "9", toModifiers: ["left_shift"] }),
  mapping({ from: "o", to: "0", toModifiers: ["left_shift"] }),
  mapping({ from: "p", to: "hyphen", toModifiers: ["left_shift"] }),
  mapping({ from: "a", to: "1", toModifiers: ["right_shift"] }),
  mapping({ from: "s", to: "hyphen" }),
  mapping({ from: "d", to: "equal_sign", toModifiers: ["left_shift"] }),
  mapping({ from: "f", to: "equal_sign" }),
  mapping({ from: "g", to: "3", toModifiers: ["right_shift"] }),
  mapping({ from: "h", to: "grave_accent_and_tilde" }),
  mapping({ from: "j", to: "backslash", toModifiers: ["left_shift"] }),
  mapping({ from: "k", to: "open_bracket", toModifiers: ["left_shift"] }),
  mapping({ from: "l", to: "close_bracket", toModifiers: ["left_shift"] }),
  mapping({ from: "semicolon", to: "slash", toModifiers: ["left_shift"] }),
  mapping({ from: "z", to: "6", toModifiers: ["right_shift"] }),
  mapping({ from: "x", to: "slash" }),
  mapping({ from: "c", to: "equal_sign", toModifiers: ["left_shift"] }),
  mapping({ from: "v", to: "backslash" }),
  // mapping({ from: "b", to: "backslash" }),
  mapping({ from: "n", to: "2", toModifiers: ["right_shift"] }),
  mapping({
    from: "m",
    to: "spacebar",
    toModifiers: ["left_control", "left_command"],
  }),
  mapping({ from: "comma", to: "open_bracket" }),
  mapping({ from: "period", to: "close_bracket" }),
  mapping({ from: "slash", to: "1", toModifiers: ["right_shift"] }),
].map(ifLayer("upper-layer"));

console.log(JSON.stringify([...upperLayer, ...baseLayer], null, 2));
