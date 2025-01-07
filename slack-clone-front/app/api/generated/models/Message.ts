/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Reaction } from './Reaction';
export type Message = {
    id?: number;
    content?: string;
    channelId?: number;
    userId?: string;
    username?: string;
    userAvatar?: string;
    timestamp?: string;
    reactions?: Array<Reaction>;
};

