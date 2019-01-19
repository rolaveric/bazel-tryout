import { MessageAction, MessageActionType } from './actions';

type MessageState = string;

export function messageReducer(state: MessageState = '', action: MessageAction): MessageState {
    switch (action.type) {
        case MessageActionType.SetMessage:
            return action.payload.message;
        default:
            return state;
    }
}