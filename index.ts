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

type KarabinerMapping = {
  type: "basic";
  from: KarabinerKey;
  to: KarabinerTo[];
  to_after_key_up?: KarabinerSetVariable[];
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

type LayerName = "upper-layer";

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

const baseLayer: KarabinerMapping[] = [
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
  simple({ key: "a" }),
  simple({ key: "s" }),
  simple({ key: "d" }),
  simple({ key: "f" }),
  simple({ key: "g" }),
  simple({ key: "h" }),
  simple({ key: "j" }),
  simple({ key: "k" }),
  simple({ key: "l" }),
  simple({ key: "semicolon" }),
  layer({ from: "z", name: "upper-layer" }),
  simple({ key: "x" }),
  simple({ key: "c" }),
  simple({ key: "v" }),
  simple({ key: "b" }),
  simple({ key: "n" }),
  simple({ key: "m" }),
  simple({ key: "comma" }),
  simple({ key: "period" }),
  layer({ from: "slash", name: "upper-layer" }),
];

const uppperLayer: KarabinerMapping[] = [
  simple({ key: "q", toModifiers: ["right_shift"] }),
  simple({ key: "w", toModifiers: ["right_shift"] }),
  simple({ key: "e", toModifiers: ["right_shift"] }),
  simple({ key: "r", toModifiers: ["right_shift"] }),
  simple({ key: "t", toModifiers: ["right_shift"] }),
  simple({ key: "y", toModifiers: ["right_shift"] }),
  simple({ key: "u", toModifiers: ["right_shift"] }),
  simple({ key: "i", toModifiers: ["right_shift"] }),
  simple({ key: "o", toModifiers: ["right_shift"] }),
  simple({ key: "p", toModifiers: ["right_shift"] }),
  simple({ key: "a", toModifiers: ["right_shift"] }),
  simple({ key: "s", toModifiers: ["right_shift"] }),
  simple({ key: "d", toModifiers: ["right_shift"] }),
  simple({ key: "f", toModifiers: ["right_shift"] }),
  simple({ key: "g", toModifiers: ["right_shift"] }),
  simple({ key: "h", toModifiers: ["right_shift"] }),
  simple({ key: "j", toModifiers: ["right_shift"] }),
  simple({ key: "k", toModifiers: ["right_shift"] }),
  simple({ key: "l", toModifiers: ["right_shift"] }),
  simple({ key: "semicolon", toModifiers: ["right_shift"] }),
  simple({ key: "z", toModifiers: ["right_shift"] }),
  simple({ key: "x", toModifiers: ["right_shift"] }),
  simple({ key: "c", toModifiers: ["right_shift"] }),
  simple({ key: "v", toModifiers: ["right_shift"] }),
  simple({ key: "b", toModifiers: ["right_shift"] }),
  simple({ key: "n", toModifiers: ["right_shift"] }),
  simple({ key: "m", toModifiers: ["right_shift"] }),
  simple({ key: "comma", toModifiers: ["right_shift"] }),
  simple({ key: "period", toModifiers: ["right_shift"] }),
  simple({ key: "slash", toModifiers: ["right_shift"] }),
];
// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);
