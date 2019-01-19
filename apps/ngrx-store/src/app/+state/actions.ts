
export const enum MessageActionType {
    SetMessage = '[Message] Set message'
}

export interface SetMessage {
    type: MessageActionType.SetMessage;
    payload: { message: string };
}

export function setMessage(message: string): SetMessage {
    return {
        type: MessageActionType.SetMessage,
        payload: { message }
    };
}

export type MessageAction = SetMessage;