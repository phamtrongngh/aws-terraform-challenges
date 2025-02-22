/* tslint:disable */
/* eslint-disable */
/**
 * Task Management API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface UpdateUserDto
 */
export interface UpdateUserDto {
    /**
     * 
     * @type {string}
     * @memberof UpdateUserDto
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateUserDto
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof UpdateUserDto
     */
    password?: string;
}

/**
 * Check if a given object implements the UpdateUserDto interface.
 */
export function instanceOfUpdateUserDto(value: object): value is UpdateUserDto {
    return true;
}

export function UpdateUserDtoFromJSON(json: any): UpdateUserDto {
    return UpdateUserDtoFromJSONTyped(json, false);
}

export function UpdateUserDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateUserDto {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'username': json['username'] == null ? undefined : json['username'],
        'password': json['password'] == null ? undefined : json['password'],
    };
}

export function UpdateUserDtoToJSON(json: any): UpdateUserDto {
    return UpdateUserDtoToJSONTyped(json, false);
}

export function UpdateUserDtoToJSONTyped(value?: UpdateUserDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'username': value['username'],
        'password': value['password'],
    };
}

