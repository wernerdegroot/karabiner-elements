export type KarabinerModifier = "left_shift" | "right_shift" | "shift" | "left_control" | "right_control" | "left_option" | "right_option" | "left_command" | "right_command" | "any";

export type KarabinerKeyFrom = { key_code: string };

export type KarabinerMouseFrom = { pointing_button: string };

export type KarabinerModifiers = {
        mandatory?: KarabinerModifier[];
        optional?: KarabinerModifier[];
};

export type KarabinerFrom = (KarabinerKeyFrom | KarabinerMouseFrom) & {
    modifiers?: KarabinerModifiers;
};

export type KarabinerKeyTo = {
    key_code: string;
    modifiers?: KarabinerModifier[];

    // Key repeating will be suppressed if false.
    repeat?: boolean;

    // A lazy modifier does not send own key events 
    // until another key is pressed together.
    lazy?: boolean;

    // The value is an interval of key_down 
    // and key_up when key_down and key_up 
    // events are sent at the same time such 
    // as multiple to events.
    hold_down_milliseconds?: number;
};

export type KarabinerMouseTo = {
    pointing_button: string;
    modifiers?: KarabinerModifier[];
};

export const TRUE = 1 as const;
export const FALSE = 0 as const

export type KarabinerBoolean = typeof TRUE | typeof FALSE;

export type KarabinerSetVariable = {
    set_variable: {
        name: string;
        value: KarabinerBoolean;
    };
};

export type KarabinerStickyModifier = {
    [M in KarabinerModifier]: {
        sticky_modifier: {
            [K in M]: "on" | "off" | "toggle";
        };
    };
}[KarabinerModifier];

export type KarabinerNotification = {
    set_notification_message: {
        id: string;
        text: string;
    };
};

export type KarabinerShellCommand = {
    shell_command: string;
};

export type KarabinerTo = KarabinerKeyTo | KarabinerMouseTo | KarabinerSetVariable | KarabinerStickyModifier | KarabinerNotification | KarabinerShellCommand;

export type KarabinerCondition = {
    name: string;
    type: "variable_if";
    value: KarabinerBoolean;
};

export type KarabinerMapping = {
    type: "basic";
    conditions?: KarabinerCondition[];
    parameters?: {
        "basic.to_if_held_down_threshold_milliseconds"?: number;
        "basic.to_delayed_action_delay_milliseconds"?: number;
    };
    from: KarabinerFrom;
    to?: KarabinerTo[];
    to_delayed_action?: {
        to_if_invoked?: KarabinerTo[];
        to_if_canceled?: KarabinerTo[];
    };
    to_if_held_down?: KarabinerTo[];
    to_if_alone?: KarabinerTo[];
    to_after_key_up?: KarabinerTo[];
};
