import * as jspb from 'google-protobuf'



export class GetRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetRequest;

  getToken(): string;
  setToken(value: string): GetRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRequest): GetRequest.AsObject;
  static serializeBinaryToWriter(message: GetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRequest;
  static deserializeBinaryFromReader(message: GetRequest, reader: jspb.BinaryReader): GetRequest;
}

export namespace GetRequest {
  export type AsObject = {
    id: string,
    token: string,
  }
}

export class GetResponse extends jspb.Message {
  getId(): string;
  setId(value: string): GetResponse;

  getName(): string;
  setName(value: string): GetResponse;
  hasName(): boolean;
  clearName(): GetResponse;

  getSurname(): string;
  setSurname(value: string): GetResponse;
  hasSurname(): boolean;
  clearSurname(): GetResponse;

  getEmail(): string;
  setEmail(value: string): GetResponse;
  hasEmail(): boolean;
  clearEmail(): GetResponse;

  getDescription(): string;
  setDescription(value: string): GetResponse;
  hasDescription(): boolean;
  clearDescription(): GetResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetResponse): GetResponse.AsObject;
  static serializeBinaryToWriter(message: GetResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetResponse;
  static deserializeBinaryFromReader(message: GetResponse, reader: jspb.BinaryReader): GetResponse;
}

export namespace GetResponse {
  export type AsObject = {
    id: string,
    name?: string,
    surname?: string,
    email?: string,
    description?: string,
  }

  export enum NameCase { 
    _NAME_NOT_SET = 0,
    NAME = 2,
  }

  export enum SurnameCase { 
    _SURNAME_NOT_SET = 0,
    SURNAME = 3,
  }

  export enum EmailCase { 
    _EMAIL_NOT_SET = 0,
    EMAIL = 4,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 5,
  }
}

export class UpdateRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateRequest;

  getToken(): string;
  setToken(value: string): UpdateRequest;

  getName(): string;
  setName(value: string): UpdateRequest;
  hasName(): boolean;
  clearName(): UpdateRequest;

  getSurname(): string;
  setSurname(value: string): UpdateRequest;
  hasSurname(): boolean;
  clearSurname(): UpdateRequest;

  getEmail(): string;
  setEmail(value: string): UpdateRequest;
  hasEmail(): boolean;
  clearEmail(): UpdateRequest;

  getPassword(): string;
  setPassword(value: string): UpdateRequest;
  hasPassword(): boolean;
  clearPassword(): UpdateRequest;

  getDescription(): string;
  setDescription(value: string): UpdateRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateRequest): UpdateRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateRequest;
  static deserializeBinaryFromReader(message: UpdateRequest, reader: jspb.BinaryReader): UpdateRequest;
}

export namespace UpdateRequest {
  export type AsObject = {
    id: string,
    token: string,
    name?: string,
    surname?: string,
    email?: string,
    password?: string,
    description?: string,
  }

  export enum NameCase { 
    _NAME_NOT_SET = 0,
    NAME = 3,
  }

  export enum SurnameCase { 
    _SURNAME_NOT_SET = 0,
    SURNAME = 4,
  }

  export enum EmailCase { 
    _EMAIL_NOT_SET = 0,
    EMAIL = 5,
  }

  export enum PasswordCase { 
    _PASSWORD_NOT_SET = 0,
    PASSWORD = 6,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 7,
  }
}

export class UpdateResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): UpdateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateResponse): UpdateResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateResponse;
  static deserializeBinaryFromReader(message: UpdateResponse, reader: jspb.BinaryReader): UpdateResponse;
}

export namespace UpdateResponse {
  export type AsObject = {
    message: string,
  }
}

export class DeleteRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteRequest;

  getToken(): string;
  setToken(value: string): DeleteRequest;

  getEmail(): string;
  setEmail(value: string): DeleteRequest;

  getPassword(): string;
  setPassword(value: string): DeleteRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteRequest): DeleteRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteRequest;
  static deserializeBinaryFromReader(message: DeleteRequest, reader: jspb.BinaryReader): DeleteRequest;
}

export namespace DeleteRequest {
  export type AsObject = {
    id: string,
    token: string,
    email: string,
    password: string,
  }
}

export class DeleteResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): DeleteResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteResponse): DeleteResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteResponse;
  static deserializeBinaryFromReader(message: DeleteResponse, reader: jspb.BinaryReader): DeleteResponse;
}

export namespace DeleteResponse {
  export type AsObject = {
    message: string,
  }
}

