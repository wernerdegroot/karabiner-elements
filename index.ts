type KarabinerModifier =
  | "left_shift"
  | "right_shift"
  | "shift"
  | "left_control"
  | "right_control"
  | "left_option"
  | "right_option"
  | "left_command"
  | "right_command"
  | "any";

type KarabinerKeyFrom = {
  key_code: string;
};

type KarabinerSimultaneousFrom = {
  simultaneous: KarabinerKeyFrom[];
  simultaneous_options?: {
    key_down_order?: "strict",
    key_up_order?: "strict_inverse",
    key_up_when?: "all"
  },
};

type KarabinerFrom = (KarabinerKeyFrom | KarabinerSimultaneousFrom) & {
  modifiers?: {
    mandatory?: KarabinerModifier[];
    optional?: KarabinerModifier[];
  };
};

type KarabinerKeyTo = {
  key_code: string;
  modifiers?: KarabinerModifier[];
  repeat?: boolean;
  lazy?: boolean;
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

function karabinerStickyModifier(modifier: KarabinerModifier, action: "on" | "off" | "toggle"): KarabinerStickyModifier {
  return {
    sticky_modifier: {
      [modifier]: action
    }
  } as KarabinerStickyModifier;
}

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
  parameters?: {
    "basic.to_if_held_down_threshold_milliseconds"?: number;
  },
  from: KarabinerFrom;
  to?: KarabinerTo[];
  to_if_held_down?: KarabinerTo[];
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
  const fromModifiers: Pick<KarabinerFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.mandatory = args.fromModifiers;
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
  | "symbol-layer-left"
  | "symbol-layer-right"
  | "navigation-layer"
  | "visual-mode-layer"
  | "modifier-layer"
  | "number-layer"
  | "function-layer";

type StickyModifier = {
  from: string;
  fromModifiers?: KarabinerModifier[];
  modifier: KarabinerModifier
}

function stickyModifier(args: StickyModifier): KarabinerMapping {
  const fromModifiers: Pick<KarabinerFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.mandatory = args.fromModifiers;
  }

  return {
    type: "basic",
    from: {
      key_code: args.from,
      ...fromModifiers,
    },
    to: [
      karabinerStickyModifier(args.modifier, "toggle")
    ]
  };
}

type Layer = {
  from: string;
  fromModifiers?: KarabinerModifier[];
  activate: LayerName;
  alsoDeactivate?: LayerName[];
};

function layer(args: Layer): KarabinerMapping {
  const fromModifiers: Pick<KarabinerFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.mandatory = args.fromModifiers;
  }

  const alsoDeactivate: LayerName[] = args.alsoDeactivate || [];
  const deactivate: KarabinerSetVariable[] = [
    args.activate,
    ...alsoDeactivate,
  ].map((name) => ({
    set_variable: {
      name,
      value: FALSE,
    },
  }));

  return {
    type: "basic",
    from: {
      key_code: args.from,
      ...fromModifiers,
    },
    to: [
      {
        set_variable: {
          name: args.activate,
          value: TRUE,
        },
      },
    ],
    to_after_key_up: deactivate,
  };
}

type LayerOn = {
  from: string;
  fromModifiers?: KarabinerModifier[];
  activate: LayerName;
};

function layerOn(args: LayerOn): KarabinerMapping {
  const fromModifiers: Pick<KarabinerFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.mandatory = args.fromModifiers;
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
          name: args.activate,
          value: TRUE,
        },
      },
    ]
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
  const fromModifiers: Pick<KarabinerFrom, "modifiers"> = {};

  fromModifiers.modifiers = {
    optional: ["any"],
  };

  if (args.fromModifiers !== undefined) {
    fromModifiers.modifiers.mandatory = args.fromModifiers;
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

const ifLayer =
  (name: LayerName, value: typeof TRUE | typeof FALSE = TRUE) =>
    (mapping: KarabinerMapping): KarabinerMapping => {

      const conditions: KarabinerCondition[] = mapping.conditions || [];

      conditions.push({
        name,
        type: "variable_if",
        value,
      });

      return { conditions, ...mapping };
    };

const baseLayerTab: KarabinerMapping[] = [
  {
    type: "basic",
    from: {
      simultaneous: [
        { key_code: "tab" },
        { key_code: "r" }
      ],
      modifiers: {
        optional: ["any"],
      },
      simultaneous_options: {
        key_down_order: "strict",
        key_up_order: "strict_inverse",
        key_up_when: "all"
      },
    },
    to: [
      {
        key_code: "left_command"
      },
      {
        key_code: "tab",
        modifiers: ["left_command"],
        repeat: false
      },
      {
        set_variable: {
          name: "symbol-layer-right",
          value: TRUE
        }
      }
    ],
    to_after_key_up: [
      {
        "set_variable": {
          "name": "symbol-layer-right",
          "value": FALSE
        }
      }
    ]
  },
  duo({ from: "tab", to: "tab", layer: "symbol-layer-right" })
];

const baseLayerSlash: KarabinerMapping = {
  type: "basic",
  from: {
    key_code: "slash",
    modifiers: {
      optional: [
        "any"
      ]
    }
  },
  to_if_alone: [
    {
      key_code: "escape"
    }
  ],
  to: [
    {
      key_code: "right_shift"
    }
  ]
};

// == Base layer =================================
// TAB  q   w   e   r   t   y   u   i   o   p  BSP
// ___  a   s   d   f   g   h   j   k   l  RET
// ___  z   x   c   v   b   n   m   ,   .  ESC
const baseLayer: KarabinerMapping[] = [
  ...baseLayerTab,
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
    layer: "symbol-layer-left",
  }),
  layer({
    from: "caps_lock",
    activate: "number-layer",
    alsoDeactivate: ["function-layer"],
  }),
  simple({ key: "a" }),
  simple({ key: "s" }),
  simple({ key: "d" }),
  simple({ key: "f" }),
  simple({ key: "g" }),
  simple({ key: "h" }),
  simple({ key: "j" }),
  simple({ key: "k" }),
  simple({ key: "l" }),
  duo({ from: "semicolon", to: "return_or_enter", layer: "modifier-layer" }),
  simple({ key: "z" }),
  simple({ key: "x" }),
  simple({ key: "c" }),
  simple({ key: "v" }),
  simple({ key: "b" }),
  simple({ key: "n" }),
  simple({ key: "m" }),
  simple({ key: "comma" }),
  simple({ key: "period" }),
  baseLayerSlash,
];

// == Upper layer ================================
// ___  Q   W   E   R   T   Y   U   I   O   P  DEL
// ___  A   S   D   F   G   H   J   K   L  ___
// ___  Z   X   C   V   B   N   M   ;   :  ___
const upperLayer: KarabinerMapping[] = [
  mapping({ from: "open_bracket", fromModifiers: ["shift"], to: "delete_forward" }),
  mapping({ from: "comma", fromModifiers: ["shift"], to: "semicolon" }),
  mapping({ from: "period", fromModifiers: ["shift"], to: "semicolon", toModifiers: ["left_shift"] }),
];

// == Symbol layer ===============================
// ___  '   <   >   "   %   ~   &   (   )   _  ___
// ___  !   -   +   =   #   `   |   {   }   ?
// ___  ^   /   *   \  ___  @  EMO  [   ]   $
const symbolLayerLeft: KarabinerMapping[] = [
  mapping({ from: "q", to: "quote" }),
  mapping({ from: "w", to: "comma", toModifiers: ["left_shift"] }),
  mapping({ from: "e", to: "period", toModifiers: ["left_shift"] }),
  mapping({ from: "r", to: "quote", toModifiers: ["left_shift"] }),
  mapping({ from: "t", to: "5", toModifiers: ["left_shift"] }),
  mapping({ from: "a", to: "1", toModifiers: ["right_shift"] }),
  mapping({ from: "s", to: "hyphen" }),
  mapping({ from: "d", to: "equal_sign", toModifiers: ["left_shift"] }),
  mapping({ from: "f", to: "equal_sign" }),
  mapping({ from: "g", to: "3", toModifiers: ["right_shift"] }),
  mapping({ from: "z", to: "6", toModifiers: ["right_shift"] }),
  mapping({ from: "x", to: "slash" }),
  mapping({ from: "c", to: "8", toModifiers: ["left_shift"] }),
  mapping({ from: "v", to: "backslash" }),
].map(ifLayer("symbol-layer-left"));

const symbolLayerRight: KarabinerMapping[] = [
  mapping({ from: "r", to: "tab", toModifiers: ["left_command"] }),
  mapping({
    from: "y",
    to: "grave_accent_and_tilde",
    toModifiers: ["right_shift"],
  }),
  mapping({ from: "u", to: "7", toModifiers: ["left_shift"] }),
  mapping({ from: "i", to: "9", toModifiers: ["left_shift"] }),
  mapping({ from: "o", to: "0", toModifiers: ["left_shift"] }),
  mapping({ from: "p", to: "hyphen", toModifiers: ["left_shift"] }),
  mapping({ from: "h", to: "grave_accent_and_tilde" }),
  mapping({ from: "j", to: "backslash", toModifiers: ["left_shift"] }),
  mapping({ from: "k", to: "open_bracket", toModifiers: ["left_shift"] }),
  mapping({ from: "l", to: "close_bracket", toModifiers: ["left_shift"] }),
  mapping({ from: "semicolon", to: "slash", toModifiers: ["left_shift"] }),
  mapping({ from: "n", to: "2", toModifiers: ["right_shift"] }),
  mapping({
    from: "m",
    to: "spacebar",
    toModifiers: ["left_control", "left_command"],
  }),
  mapping({ from: "comma", to: "open_bracket" }),
  mapping({ from: "period", to: "close_bracket" }),
  mapping({ from: "slash", to: "4", toModifiers: ["right_shift"] }),
].map(ifLayer("symbol-layer-right"));

const navigationLayerSpace: KarabinerMapping = {
  "type": "basic",
  "from": {
    "key_code": "spacebar",
    "modifiers": {
      "optional": [
        "any"
      ]
    }
  },
  "to": [
    {
      "key_code": "left_shift"
    }
  ],
  "to_if_alone": [
    {
      "set_variable": {
        "name": "visual-mode-layer",
        "value": TRUE
      }
    }
  ]
};

const visualModeLayerSpace: KarabinerMapping = {
  "type": "basic",
  "from": {
    "key_code": "spacebar",
    "modifiers": {
      "optional": [
        "any"
      ]
    }
  },
  "to": [
    {
      "set_variable": {
        "name": "visual-mode-layer",
        "value": FALSE
      }
    }
  ]
}

// == Navigation layer ===========================
// ___ ___ ___ ___ ___ ___ HOM PGU PGD END ___ ___
// ___  ^   ⌥   ⌘  ___ ___  ←   ↓   ↑   →  ___
// ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
//                        ⇧                   
const navigationLayer: KarabinerMapping[] = [
  mapping({ from: "y", to: "home" }),
  mapping({ from: "u", to: "page_up" }),
  mapping({ from: "i", to: "page_down" }),
  mapping({ from: "o", to: "end" }),
  mapping({ from: "s", to: "left_control" }),
  mapping({ from: "d", to: "left_option" }),
  mapping({ from: "f", to: "left_command" }),
  mapping({ from: "h", to: "left_arrow" }),
  mapping({ from: "j", to: "down_arrow" }),
  mapping({ from: "k", to: "up_arrow" }),
  mapping({ from: "l", to: "right_arrow" }),
  navigationLayerSpace,
].map(ifLayer("navigation-layer")).map(ifLayer("visual-mode-layer", FALSE));

const visualModeLayer: KarabinerMapping[] = [
  mapping({ from: "s", to: "left_control", toModifiers: ["left_shift"] }),
  mapping({ from: "d", to: "left_option", toModifiers: ["left_shift"] }),
  mapping({ from: "f", to: "left_command", toModifiers: ["left_shift"] }),
  mapping({ from: "h", to: "left_arrow", toModifiers: ["left_shift"] }),
  mapping({ from: "j", to: "down_arrow", toModifiers: ["left_shift"] }),
  mapping({ from: "k", to: "up_arrow", toModifiers: ["left_shift"] }),
  mapping({ from: "l", to: "right_arrow", toModifiers: ["left_shift"] }),
  visualModeLayerSpace,
].map(ifLayer("navigation-layer")).map(ifLayer("visual-mode-layer"));

// == Modifier layer =============================
// ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
// ___  ^   ⌥   ⌘  ___ ___ ___ ___ ___ ___ ___
// ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
//                        ⇧                   
const modifierLayer: KarabinerMapping[] = [
  layer({ from: "a", activate: "navigation-layer", alsoDeactivate: ["visual-mode-layer"] }),
  stickyModifier({ from: "s", modifier: "left_control" }),
  stickyModifier({ from: "d", modifier: "left_option" }),
  stickyModifier({ from: "f", modifier: "left_command" }),
  stickyModifier({ from: "spacebar", modifier: "left_shift" }),
].map(ifLayer("modifier-layer"));

// == Number layer ===============================
// ___ ___ ___ ___ ___ ___ ___  7   8   9  ___ ___
// ___ ___ ___ ___ ___ ___ ___  4   5   6  ___
// ___ ___ ___ ___ ___ ___  0   1   2   3  ___
const numberLayer: KarabinerMapping[] = [
  mapping({ from: "u", to: "7" }),
  mapping({ from: "i", to: "8" }),
  mapping({ from: "o", to: "9" }),
  mapping({ from: "j", to: "4" }),
  mapping({ from: "k", to: "5" }),
  mapping({ from: "l", to: "6" }),
  mapping({ from: "n", to: "0" }),
  mapping({ from: "m", to: "1" }),
  mapping({ from: "comma", to: "2" }),
  mapping({ from: "period", to: "3" }),
  layerOn({ from: "spacebar", activate: "function-layer" })
].map(ifLayer("number-layer")).map(ifLayer("function-layer", FALSE));

// == Function layer =============================
// ___ ___ ___ ___ ___ ___ ___ F7  F8  F9  F12 ___
// ___ ___ ___ ___ ___ ___ ___ F4  F5  F6  F11
// ___ ___ ___ ___ ___ ___ ___ F1  F2  F3  F10
const functionLayer: KarabinerMapping[] = [
  mapping({ from: "u", to: "f7" }),
  mapping({ from: "i", to: "f8" }),
  mapping({ from: "o", to: "f9" }),
  mapping({ from: "p", to: "f12" }),
  mapping({ from: "j", to: "f4" }),
  mapping({ from: "k", to: "f5" }),
  mapping({ from: "l", to: "f6" }),
  mapping({ from: "semicolon", to: "f11" }),
  mapping({ from: "m", to: "f1" }),
  mapping({ from: "comma", to: "f2" }),
  mapping({ from: "period", to: "f3" }),
  mapping({ from: "slash", to: "f10" }),
].map(ifLayer("number-layer")).map(ifLayer("function-layer"));

console.log(
  JSON.stringify({
    "title": "Werner's keymap",
    "manipulators": [
      ...upperLayer,
      ...symbolLayerLeft,
      ...symbolLayerRight,
      ...navigationLayer,
      ...visualModeLayer,
      ...modifierLayer,
      ...numberLayer,
      ...functionLayer,
      ...baseLayer
    ]
  }, null, 2)
);
