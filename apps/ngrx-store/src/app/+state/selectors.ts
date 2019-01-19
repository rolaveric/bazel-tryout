import { State } from './interface';

export function getMessage(state: State): string {
    return state.message;
}