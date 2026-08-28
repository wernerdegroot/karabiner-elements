import fs from "fs";
import * as KT from "./karabiner-types";
import { mapping, simple, none, duo, layerOn, layerOff, stickyModifier, ifLayer, toKey, from, beep } from "./helpers";

const baseLayerLeftShift: KT.KarabinerMapping = {
    type: "basic",
    ...from({ from: "left_shift" }),
    to: [
        {
            set_variable: {
                name: "upper-layer",
                value: KT.TRUE
            }
        },
        {
            key_code: "left_shift"
        }
    ],
    to_if_alone: [
        {
            set_notification_message: {
                id: "navigation-layer",
                text: "navigation-layer"
            }
        },
        {
            set_variable: {
                name: "navigation-layer",
                value: KT.TRUE
            }
        }
    ],
    to_after_key_up: [
        {
            set_variable: {
                name: "upper-layer",
                value: KT.FALSE
            }
        }
    ]
};

function baseLayerRightShiftFor(keyCode: string): KT.KarabinerMapping {
    return {
        type: "basic",
        ...from({ from: keyCode }),
        to: [
            {
                set_variable: {
                    name: "upper-layer",
                    value: KT.TRUE
                }
            },
            {
                key_code: "right_shift"
            }
        ],
        to_after_key_up: [
            {
                set_variable: {
                    name: "upper-layer",
                    value: KT.FALSE
                }
            }
        ]
    };
}

// == Base layer =================================
// TAB  q   w   e   r   t   y   u   i   o   p  BSP
// ESC  a   s   d   f   g   h   j   k   l  RET
// ___  z   x   c   v   b   n   m   ,   .  ___
const baseLayer: KT.KarabinerMapping[] = [
    duo({ from: "tab", to: "tab", activate: "symbol-layer-right" }),
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
        activate: "symbol-layer-left"
    }),
    duo({
        from: "delete_or_backspace",
        to: "delete_or_backspace",
        activate: "symbol-layer-left"
    }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    duo({
        from: "caps_lock",
        to: "escape",
        activate: "number-layer",
        alsoDeactivate: ["function-layer"]
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
    duo({ from: "semicolon", to: "return_or_enter", activate: "modifier-layer" }),
    none({ from: "quote" }),
    duo({ from: "return_or_enter", to: "return_or_enter", activate: "modifier-layer" }),
    baseLayerLeftShift,
    simple({ key: "z" }),
    simple({ key: "x" }),
    simple({ key: "c" }),
    simple({ key: "v" }),
    simple({ key: "b" }),
    simple({ key: "n" }),
    simple({ key: "m" }),
    duo({ from: "comma", to: "comma", activate: "comma-layer" }),
    simple({ key: "period" }),
    baseLayerRightShiftFor("slash"),
    baseLayerRightShiftFor("right_shift")
];

// == Upper layer ================================
// ___  Q   W   E   R   T   Y   U   I   O   P  DEL
// ___  A   S   D   F   G   H   J   K   L   :
// ___  Z   X   C   V   B   N   M   <   >   ?
const upperLayer: KT.KarabinerMapping[] = [
    mapping({ from: "open_bracket", fromModifiers: ["shift"], to: "delete_forward" }),
    none({ from: "close_bracket", fromModifiers: ["shift"] }),
    none({ from: "backslash", fromModifiers: ["shift"] }),
    ifLayer("upper-layer")(
        mapping({
            from: "semicolon",
            fromModifiers: ["shift"],
            to: "semicolon",
            toModifiers: ["left_shift"]
        })
    ),
    none({ from: "quote", fromModifiers: ["shift"] }),
    ifLayer("upper-layer")(
        mapping({
            from: "return_or_enter",
            fromModifiers: ["shift"],
            to: "semicolon",
            toModifiers: ["left_shift"]
        })
    ),
    // mapping({ from: "return_or_enter", fromModifiers: ["shift"], to: "semicolon", toModifiers: ["left_shift"] }),
    mapping({ from: "slash", fromModifiers: ["shift"], to: "slash", toModifiers: ["left_shift"] }),
    mapping({
        from: "right_shift",
        fromModifiers: ["shift"],
        to: "slash",
        toModifiers: ["left_shift"]
    }),
    // Gate on upper-layer so sticky shift + comma re-enters the comma layer instead of typing "<".
    ifLayer("upper-layer")(mapping({ from: "comma", fromModifiers: ["shift"], to: "comma", toModifiers: ["left_shift"] }))
];

// == Symbol layer ===============================
// ___  '   <   >   "   %   ~   &   (   )   _  ___
// ___  !   -   +   =   #   `   |   {   }  ___
// ___  ^   /   *   \  ___  @  EMO  [   ]   $
const symbolLayerLeft: KT.KarabinerMapping[] = [
    none({ from: "tab" }),
    mapping({ from: "q", to: "quote" }),
    mapping({ from: "w", to: "comma", toModifiers: ["left_shift"] }),
    mapping({ from: "e", to: "period", toModifiers: ["left_shift"] }),
    mapping({ from: "r", to: "quote", toModifiers: ["left_shift"] }),
    mapping({ from: "t", to: "5", toModifiers: ["left_shift"] }),
    mapping({ from: "u", to: "tab", toModifiers: ["left_control"] }),
    mapping({ from: "i", to: "tab", toModifiers: ["left_control", "left_shift"] }),
    none({ from: "caps_lock" }),
    mapping({ from: "a", to: "1", toModifiers: ["right_shift"] }),
    mapping({ from: "s", to: "hyphen" }),
    mapping({ from: "d", to: "equal_sign", toModifiers: ["left_shift"] }),
    mapping({ from: "f", to: "equal_sign" }),
    mapping({ from: "g", to: "3", toModifiers: ["right_shift"] }),
    none({ from: "left_shift" }),
    mapping({ from: "z", to: "6", toModifiers: ["right_shift"] }),
    mapping({ from: "x", to: "slash" }),
    mapping({ from: "c", to: "8", toModifiers: ["left_shift"] }),
    mapping({ from: "v", to: "backslash" })
].map(ifLayer("symbol-layer-left"));

const symbolLayerRight: KT.KarabinerMapping[] = [
    mapping({ from: "e", to: "tab", toModifiers: ["left_command", "left_shift"] }),
    mapping({ from: "r", to: "tab", toModifiers: ["left_command"] }),
    mapping({
        from: "y",
        to: "grave_accent_and_tilde",
        toModifiers: ["right_shift"]
    }),
    mapping({ from: "u", to: "7", toModifiers: ["left_shift"] }),
    mapping({ from: "i", to: "9", toModifiers: ["left_shift"] }),
    mapping({ from: "o", to: "0", toModifiers: ["left_shift"] }),
    mapping({ from: "p", to: "hyphen", toModifiers: ["left_shift"] }),
    none({ from: "open_bracket" }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    mapping({ from: "h", to: "grave_accent_and_tilde" }),
    mapping({ from: "j", to: "backslash", toModifiers: ["left_shift"] }),
    mapping({ from: "k", to: "open_bracket", toModifiers: ["left_shift"] }),
    mapping({ from: "l", to: "close_bracket", toModifiers: ["left_shift"] }),
    mapping({ from: "semicolon", to: "slash", toModifiers: ["left_shift"] }),
    none({ from: "quote" }),
    mapping({ from: "return_or_enter", to: "slash", toModifiers: ["left_shift"] }),
    mapping({ from: "n", to: "2", toModifiers: ["right_shift"] }),
    mapping({
        from: "m",
        to: "spacebar",
        toModifiers: ["left_control", "left_command"]
    }),
    mapping({ from: "comma", to: "open_bracket" }),
    mapping({ from: "period", to: "close_bracket" }),
    mapping({ from: "slash", to: "4", toModifiers: ["right_shift"] }),
    mapping({ from: "right_shift", to: "4", toModifiers: ["right_shift"] })
].map(ifLayer("symbol-layer-right"));

// == Comma layer ================================
// TAB ⌘+Q ⌘+W ___ ___ ___ ___ ___ ___ ___ ___ BSP
// ESC  ⇧   ^   ⌥   ⌘   ⇪  ___ ___ ___ ___ RET
// ___ ⌘+Z ⌘+X ⌘+C ⌘+V ___ ___ ___  ,  ___ ___
//                       SPC
//
// TAB/ESC/SPC/RET/BSP: prevent rollover mistakes while typing.

function commaIgnore(key: string): KT.KarabinerMapping {
    return {
        type: "basic",
        ...from({ from: key }),
        to: [beep]
    };
}

const commaLayer: KT.KarabinerMapping[] = [
    mapping({ from: "tab", to: ["comma", "tab"] }),
    mapping({ from: "q", to: "q", toModifiers: ["left_command"] }),
    mapping({ from: "w", to: "w", toModifiers: ["left_command"] }),
    commaIgnore("e"),
    commaIgnore("r"),
    commaIgnore("t"),
    commaIgnore("y"),
    commaIgnore("u"),
    commaIgnore("i"),
    commaIgnore("o"),
    commaIgnore("p"),
    mapping({ from: "open_bracket", to: ["comma", "delete_or_backspace"] }),
    commaIgnore("close_bracket"),
    commaIgnore("backslash"),
    mapping({ from: "close_bracket", to: ["comma", "delete_or_backspace"] }),
    mapping({ from: "delete_or_backspace", to: ["comma", "delete_or_backspace"] }),
    mapping({ from: "caps_lock", to: ["comma", "escape"] }),
    stickyModifier({ from: "a", modifier: "left_shift" }),
    stickyModifier({ from: "s", modifier: "left_control" }),
    stickyModifier({ from: "d", modifier: "left_option" }),
    stickyModifier({ from: "f", modifier: "left_command" }),
    mapping({ from: "g", to: "caps_lock" }),
    commaIgnore("h"),
    commaIgnore("j"),
    commaIgnore("k"),
    commaIgnore("l"),
    mapping({ from: "semicolon", to: ["comma", "return_or_enter"] }),
    commaIgnore("quote"),
    mapping({ from: "return_or_enter", to: ["comma", "return_or_enter"] }),
    commaIgnore("left_shift"),
    mapping({ from: "z", to: "z", toModifiers: ["left_command"] }),
    mapping({ from: "x", to: "x", toModifiers: ["left_command"] }),
    mapping({ from: "c", to: "c", toModifiers: ["left_command"] }),
    mapping({ from: "v", to: "v", toModifiers: ["left_command"] }),
    commaIgnore("b"),
    commaIgnore("n"),
    commaIgnore("m"),
    commaIgnore("period"),
    commaIgnore("slash"),
    commaIgnore("right_shift"),
    mapping({ from: "spacebar", to: ["comma", "spacebar"] })
].map(ifLayer("comma-layer"));

const navigationLayerSpace: KT.KarabinerMapping = {
    type: "basic",
    from: {
        key_code: "spacebar",
        modifiers: {
            optional: ["any"]
        }
    },
    to: [
        {
            key_code: "left_shift"
        }
    ],
    to_if_alone: [
        {
            set_variable: {
                name: "visual-mode-layer",
                value: KT.TRUE
            }
        }
    ]
};

const visualModeLayerSpace: KT.KarabinerMapping = {
    type: "basic",
    from: {
        key_code: "spacebar",
        modifiers: {
            optional: ["any"]
        }
    },
    to: [
        {
            set_variable: {
                name: "visual-mode-layer",
                value: KT.FALSE
            }
        }
    ]
};

const hideNavigationLayerNotification: KT.KarabinerNotification = {
    set_notification_message: {
        id: "navigation-layer",
        text: ""
    }
};

// == Navigation layer ===========================
// ___ ___ ___ ___ ___ ___ HOM PGD PGU END ___ ___
//  ×   ×   ^   ⌥   ⌘  ___  ←   ↓   ↑   →  ___
// ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
//                        ⇧
const navigationLayer: KT.KarabinerMapping[] = [
    none({ from: "tab" }),
    none({ from: "q" }),
    none({ from: "w" }),
    none({ from: "e" }),
    none({ from: "r" }),
    none({ from: "t" }),
    mapping({ from: "y", to: "home" }),
    mapping({ from: "u", to: "page_down" }),
    mapping({ from: "i", to: "page_up" }),
    mapping({ from: "o", to: "end" }),
    none({ from: "p" }),
    layerOff({
        from: "open_bracket",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification, toKey("delete_or_backspace")]
    }),
    layerOff({
        from: "delete_or_backspace",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification, toKey("delete_or_backspace")]
    }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    layerOff({
        from: "caps_lock",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification, toKey("escape")]
    }),
    layerOff({
        from: "a",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification]
    }),
    mapping({ from: "s", to: "left_control" }),
    mapping({ from: "d", to: "left_option" }),
    mapping({ from: "f", to: "left_command" }),
    none({ from: "g" }),
    mapping({ from: "h", to: "left_arrow" }),
    mapping({ from: "j", to: "down_arrow" }),
    mapping({ from: "k", to: "up_arrow" }),
    mapping({ from: "l", to: "right_arrow" }),
    layerOff({
        from: "semicolon",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification, toKey("return_or_enter")]
    }),
    none({ from: "quote" }),
    layerOff({
        from: "return_or_enter",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification, toKey("return_or_enter")]
    }),
    layerOff({
        from: "left_shift",
        deactivate: "navigation-layer",
        also: [hideNavigationLayerNotification]
    }),
    none({ from: "z" }),
    none({ from: "x" }),
    none({ from: "c" }),
    none({ from: "v" }),
    none({ from: "b" }),
    none({ from: "n" }),
    none({ from: "m" }),
    none({ from: "comma" }),
    none({ from: "period" }),
    none({ from: "slash" }),
    none({ from: "right_shift" }),
    navigationLayerSpace
]
    .map(ifLayer("navigation-layer"))
    .map(ifLayer("visual-mode-layer", KT.FALSE));

const visualModeLayer: KT.KarabinerMapping[] = [
    none({ from: "tab" }),
    none({ from: "q" }),
    none({ from: "w" }),
    none({ from: "e" }),
    none({ from: "r" }),
    none({ from: "t" }),
    mapping({ from: "y", to: "home", toModifiers: ["left_shift"] }),
    mapping({ from: "u", to: "page_up", toModifiers: ["left_shift"] }),
    mapping({ from: "i", to: "page_down", toModifiers: ["left_shift"] }),
    mapping({ from: "o", to: "end", toModifiers: ["left_shift"] }),
    none({ from: "p" }),
    layerOff({
        from: "open_bracket",
        deactivate: ["visual-mode-layer", "navigation-layer"],
        also: [hideNavigationLayerNotification, toKey("delete_or_backspace")]
    }),
    layerOff({
        from: "delete_or_backspace",
        deactivate: ["visual-mode-layer", "navigation-layer"],
        also: [hideNavigationLayerNotification, toKey("delete_or_backspace")]
    }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    layerOff({
        from: "caps_lock",
        deactivate: ["visual-mode-layer", "navigation-layer"],
        also: [hideNavigationLayerNotification, toKey("escape")]
    }),
    layerOff({
        from: "a",
        deactivate: ["visual-mode-layer", "navigation-layer"],
        also: [hideNavigationLayerNotification]
    }),
    mapping({ from: "s", to: "left_control", toModifiers: ["left_shift"] }),
    mapping({ from: "d", to: "left_option", toModifiers: ["left_shift"] }),
    mapping({ from: "f", to: "left_command", toModifiers: ["left_shift"] }),
    none({ from: "g" }),
    mapping({ from: "h", to: "left_arrow", toModifiers: ["left_shift"] }),
    mapping({ from: "j", to: "down_arrow", toModifiers: ["left_shift"] }),
    mapping({ from: "k", to: "up_arrow", toModifiers: ["left_shift"] }),
    mapping({ from: "l", to: "right_arrow", toModifiers: ["left_shift"] }),
    layerOff({
        from: "semicolon",
        deactivate: ["visual-mode-layer", "navigation-layer"],
        also: [hideNavigationLayerNotification, toKey("return_or_enter")]
    }),
    none({ from: "quote" }),
    none({ from: "return_or_enter" }),
    layerOff({
        from: "left_shift",
        deactivate: ["visual-mode-layer", "navigation-layer"],
        also: [hideNavigationLayerNotification]
    }),
    none({ from: "z" }),
    none({ from: "x" }),
    none({ from: "c" }),
    none({ from: "v" }),
    none({ from: "b" }),
    none({ from: "n" }),
    none({ from: "m" }),
    none({ from: "comma" }),
    none({ from: "period" }),
    none({ from: "slash" }),
    none({ from: "right_shift" }),
    visualModeLayerSpace
]
    .map(ifLayer("navigation-layer"))
    .map(ifLayer("visual-mode-layer"));

// == Modifier layer =============================
// ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
// ___  ^   ⌥   ⌘   ⇪  ___ ___ ___ ___ ___ ___
// ___ ___ ___ ___ ___ ___ ___ ___ ___ ___ ___
//                        ⇧
const modifierLayer: KT.KarabinerMapping[] = [
    none({ from: "tab" }),
    none({ from: "q" }),
    none({ from: "w" }),
    none({ from: "e" }),
    none({ from: "r" }),
    none({ from: "t" }),
    none({ from: "y" }),
    none({ from: "u" }),
    none({ from: "i" }),
    none({ from: "o" }),
    none({ from: "p" }),
    none({ from: "open_bracket" }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    none({ from: "caps_lock" }),
    none({ from: "a" }),
    stickyModifier({ from: "s", modifier: "left_control" }),
    stickyModifier({ from: "d", modifier: "left_option" }),
    stickyModifier({ from: "f", modifier: "left_command" }),
    mapping({ from: "g", to: "caps_lock" }),
    none({ from: "h" }),
    none({ from: "j" }),
    none({ from: "k" }),
    none({ from: "l" }),
    none({ from: "semicolon" }),
    none({ from: "quote" }),
    none({ from: "return_or_enter" }),
    none({ from: "left_shift" }),
    none({ from: "z" }),
    none({ from: "x" }),
    none({ from: "c" }),
    none({ from: "v" }),
    none({ from: "b" }),
    none({ from: "n" }),
    none({ from: "m" }),
    none({ from: "comma" }),
    none({ from: "period" }),
    none({ from: "slash" }),
    none({ from: "right_shift" }),
    stickyModifier({ from: "spacebar", modifier: "left_shift" })
].map(ifLayer("modifier-layer"));

// == Number layer ===============================
// ___ ___ ___ ___ ___ ___ ___  7   8   9   p  ___
// ___ ___ ___ ___ ___ ___ ___  4   5   6   ;
// ___ ___ ___ ___ ___ ___ ___  1   2   3   /
const numberLayer: KT.KarabinerMapping[] = [
    none({ from: "tab" }),
    none({ from: "q" }),
    none({ from: "w" }),
    none({ from: "e" }),
    none({ from: "r" }),
    none({ from: "t" }),
    none({ from: "y" }),
    mapping({ from: "u", to: "7" }),
    mapping({ from: "i", to: "8" }),
    mapping({ from: "o", to: "9" }),
    simple({ key: "p" }),
    none({ from: "open_bracket" }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    none({ from: "caps_lock" }),
    none({ from: "a" }),
    none({ from: "s" }),
    mapping({
        from: "d",
        to: "grave_accent_and_tilde",
        toModifiers: ["left_command", "left_shift"]
    }),
    mapping({ from: "f", to: "grave_accent_and_tilde", toModifiers: ["left_command"] }),
    none({ from: "g" }),
    layerOn({ from: "h", activate: "function-layer" }),
    mapping({ from: "j", to: "4" }),
    mapping({ from: "k", to: "5" }),
    mapping({ from: "l", to: "6" }),
    simple({ key: "semicolon" }),
    none({ from: "quote" }),
    mapping({ from: "return_or_enter", to: "semicolon" }),
    none({ from: "left_shift" }),
    none({ from: "z" }),
    none({ from: "x" }),
    none({ from: "c" }),
    none({ from: "v" }),
    none({ from: "b" }),
    none({ from: "n" }),
    mapping({ from: "m", to: "1" }),
    mapping({ from: "comma", to: "2" }),
    mapping({ from: "period", to: "3" }),
    simple({ key: "slash" }),
    mapping({ from: "right_shift", to: "slash" }),
    mapping({ from: "spacebar", to: "0" })
]
    .map(ifLayer("number-layer"))
    .map(ifLayer("function-layer", KT.FALSE));

// == Function layer =============================
// ___ ___ ___ ___ ___ ___ ___ F7  F8  F9  F12 ___
// ___ ___ ___ ___ ___ ___ ___ F4  F5  F6  F11
// ___ ___ ___ ___ ___ ___ ___ F1  F2  F3  F10
const functionLayer: KT.KarabinerMapping[] = [
    none({ from: "tab" }),
    none({ from: "q" }),
    none({ from: "w" }),
    none({ from: "e" }),
    none({ from: "r" }),
    none({ from: "t" }),
    none({ from: "y" }),
    mapping({ from: "u", to: "f7" }),
    mapping({ from: "i", to: "f8" }),
    mapping({ from: "o", to: "f9" }),
    mapping({ from: "p", to: "f12" }),
    none({ from: "open_bracket" }),
    none({ from: "close_bracket" }),
    none({ from: "backslash" }),
    none({ from: "caps_lock" }),
    none({ from: "a" }),
    none({ from: "s" }),
    none({ from: "d" }),
    none({ from: "f" }),
    none({ from: "g" }),
    none({ from: "h" }),
    mapping({ from: "j", to: "f4" }),
    mapping({ from: "k", to: "f5" }),
    mapping({ from: "l", to: "f6" }),
    mapping({ from: "semicolon", to: "f11" }),
    none({ from: "quote" }),
    none({ from: "return_or_enter" }),
    none({ from: "left_shift" }),
    none({ from: "z" }),
    none({ from: "x" }),
    none({ from: "c" }),
    none({ from: "v" }),
    none({ from: "b" }),
    none({ from: "n" }),
    mapping({ from: "m", to: "f1" }),
    mapping({ from: "comma", to: "f2" }),
    mapping({ from: "period", to: "f3" }),
    mapping({ from: "slash", to: "f10" }),
    none({ from: "right_shift" })
]
    .map(ifLayer("number-layer"))
    .map(ifLayer("function-layer"));

const karabinerJsonContents = JSON.stringify(
    {
        profiles: [
            {
                complex_modifications: {
                    rules: [
                        {
                            description: "Werner's keymap",
                            manipulators: [
                                ...symbolLayerLeft,
                                ...symbolLayerRight,
                                ...navigationLayer,
                                ...visualModeLayer,
                                ...modifierLayer,
                                ...numberLayer,
                                ...functionLayer,
                                ...upperLayer,
                                ...commaLayer,
                                ...baseLayer
                            ]
                        }
                    ]
                },
                devices: [
                    // Chilkey ND75:
                    {
                        identifiers: {
                            is_keyboard: true,
                            product_id: 11175,
                            vendor_id: 14005
                        },
                        simple_modifications: [
                            {
                                from: { key_code: "left_option" },
                                to: [{ key_code: "left_command" }]
                            },
                            {
                                from: { key_code: "left_command" },
                                to: [{ key_code: "left_option" }]
                            }
                        ]
                    },

                    // Feker Alice75:
                    {
                        identifiers: {
                            is_keyboard: true,
                            is_pointing_device: true,
                            product_id: 12310,
                            vendor_id: 14000
                        },
                        ignore: false,
                        simple_modifications: [
                            {
                                from: { key_code: "left_command" },
                                to: [{ key_code: "left_option" }]
                            },
                            {
                                from: { key_code: "left_option" },
                                to: [{ key_code: "left_command" }]
                            }
                        ]
                    },

                    // MMD KM40:
                    {
                        identifiers: {
                            is_keyboard: true,
                            is_pointing_device: true,
                            product_id: 12697,
                            vendor_id: 10473
                        },
                        ignore: false
                    }
                ],
                name: "Default profile",
                selected: true,
                virtual_hid_keyboard: { keyboard_type_v2: "ansi" }
            }
        ]
    },
    null,
    2
);

fs.writeFileSync("output.json", karabinerJsonContents);
