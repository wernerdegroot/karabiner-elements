import * as KT from "./karabiner-types";

export type From = {
    from: string;
    fromModifiers?: KT.KarabinerModifier[];
};

export function from(args: From): Pick<KT.KarabinerMapping, "from"> {
    const modifiers: KT.KarabinerModifiers = {
        optional: ["any"]
    };

    if (args.fromModifiers !== undefined) {
        modifiers.mandatory = args.fromModifiers;
    }

    return {
        from: {
            key_code: args.from,
            modifiers
        }
    };
}

export type Mapping = From & {
    to: string | string[];
    toModifiers?: KT.KarabinerModifier[];
};

export function mapping(args: Mapping): KT.KarabinerMapping {
    const toModifiers: Pick<KT.KarabinerKeyTo, "modifiers"> = args.toModifiers == undefined ? {} : { modifiers: args.toModifiers };

    const to = Array.isArray(args.to) ? args.to : [args.to];

    return {
        type: "basic",
        ...from(args),
        to: to.map((key) => ({
            key_code: key,
            ...toModifiers
        }))
    };
}

export type LayerName =
    | "upper-layer"
    | "symbol-layer-left"
    | "symbol-layer-right"
    | "navigation-layer"
    | "visual-mode-layer"
    | "number-layer"
    | "function-layer"
    | "modifier-layer";

export type Layer = From & {
    activate: LayerName;

    // When the layer is deactived, 
    // also deactivate the following layers:
    alsoDeactivate?: LayerName[];
};

export function layer(args: Layer): KT.KarabinerMapping {
    const alsoDeactivate: LayerName[] = args.alsoDeactivate || [];
    const deactivate: KT.KarabinerSetVariable[] = [args.activate, ...alsoDeactivate].map((name) => ({
        set_variable: {
            name,
            value: KT.FALSE
        }
    }));

    return {
        type: "basic",
        ...from(args),
        to: [
            {
                set_variable: {
                    name: args.activate,
                    value: KT.TRUE
                }
            }
        ],
        to_after_key_up: deactivate
    };
}

export type LayerOn = From & {
    activate: LayerName;
};

export function layerOn(args: LayerOn): KT.KarabinerMapping {
    return {
        type: "basic",
        ...from(args),
        to: [
            {
                set_variable: {
                    name: args.activate,
                    value: KT.TRUE
                }
            }
        ]
    };
}

export type LayerOff = From & {
    deactivate: LayerName | LayerName[];
    also?: KT.KarabinerTo[];
};

export function layerOff(args: LayerOff): KT.KarabinerMapping {
    const toDeactivate = Array.isArray(args.deactivate) ? args.deactivate : [args.deactivate];
    const also = args.also ?? [];

    return {
        type: "basic",
        ...from(args),
        to: [
            ...toDeactivate.map((name) => ({
                set_variable: {
                    name,
                    value: KT.FALSE
                }
            })),
            ...also
        ]
    };
}

export function karabinerStickyModifier(modifier: KT.KarabinerModifier, action: "on" | "off" | "toggle"): KT.KarabinerStickyModifier {
    return {
        sticky_modifier: {
            [modifier]: action
        }
    } as KT.KarabinerStickyModifier;
}

export type StickyModifier = From & {
    modifier: KT.KarabinerModifier;
};

export function stickyModifier(args: StickyModifier): KT.KarabinerMapping {
    return {
        type: "basic",
        ...from(args),
        to: [karabinerStickyModifier(args.modifier, "toggle")]
    };
}

export type SimplifiedMapping = {
    key: string;
    toModifiers?: KT.KarabinerModifier[];
};

export function simple(args: SimplifiedMapping): KT.KarabinerMapping {
    return mapping({
        from: args.key,
        to: args.key,
        toModifiers: args.toModifiers
    });
}

export type NoneMapping = From;

export function none(args: NoneMapping): KT.KarabinerMapping {
    return {
        type: "basic",
        ...from(args),
        to: [
            {
                key_code: "vk_none"
            }
        ]
    };
}

export type DuoMapping = Mapping & {
    activate: LayerName;

    // When the layer is deactived, 
    // also deactivate the following layers:
    alsoDeactivate?: LayerName[];
};

export function duo(args: DuoMapping): KT.KarabinerMapping {
    const toModifiers: Pick<KT.KarabinerKeyTo, "modifiers"> = args.toModifiers == undefined ? {} : { modifiers: args.toModifiers };

    const to = Array.isArray(args.to) ? args.to : [args.to];
    const alsoDeactivate: LayerName[] = args.alsoDeactivate || [];
    const deactivate: KT.KarabinerSetVariable[] = [args.activate, ...alsoDeactivate].map((name) => ({
        set_variable: {
            name,
            value: KT.FALSE
        }
    }));

    return {
        type: "basic",
        ...from(args),
        to_if_alone: to.map((key) => ({
            key_code: key,
            ...toModifiers
        })),
        to: [
            {
                set_variable: {
                    name: args.activate,
                    value: KT.TRUE
                }
            }
        ],
        to_after_key_up: deactivate
    };
}

export const ifLayer =
    (name: LayerName, value: typeof KT.TRUE | typeof KT.FALSE = KT.TRUE) =>
    (mapping: KT.KarabinerMapping): KT.KarabinerMapping => {
        const { conditions = [], ...rest } = mapping;

        const condition: KT.KarabinerCondition = {
            name,
            type: "variable_if",
            value
        };

        return {
            conditions: [...conditions, condition],
            ...rest
        };
    };

export function toKey(key: string): KT.KarabinerKeyTo {
    return {
        key_code: key
    };
}

export const beep: KT.KarabinerShellCommand = {
    shell_command: "afplay /System/Library/Sounds/Basso.aiff"
};
