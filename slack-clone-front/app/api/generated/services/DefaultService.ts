/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Channel } from '../models/Channel';
import type { Message } from '../models/Message';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get all channels
     * @returns Channel List of all channels
     * @throws ApiError
     */
    public static getApiChannels(): CancelablePromise<Array<Channel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/channels',
            errors: {
                500: `Database connection error`,
            },
        });
    }
    /**
     * Create a new channel
     * @param requestBody
     * @returns Channel Channel created successfully
     * @throws ApiError
     */
    public static postApiChannels(
        requestBody: {
            name: string;
        },
    ): CancelablePromise<Channel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/channels',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                500: `Database error`,
            },
        });
    }
    /**
     * Get messages for a channel
     * @param channelId
     * @returns Message List of messages
     * @throws ApiError
     */
    public static getApiMessages(
        channelId: string,
    ): CancelablePromise<Array<Message>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/messages',
            query: {
                'channelId': channelId,
            },
            errors: {
                400: `Channel ID is required`,
                500: `Database connection error`,
            },
        });
    }
    /**
     * Create a new message
     * @param requestBody
     * @returns Message Message created successfully
     * @throws ApiError
     */
    public static postApiMessages(
        requestBody: {
            channelId: number;
            userId: string;
            text: string;
            username: string;
            userAvatar?: string;
        },
    ): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/messages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Missing required fields`,
                500: `Database connection error`,
            },
        });
    }
}
