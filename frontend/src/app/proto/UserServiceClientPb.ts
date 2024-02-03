/**
 * @fileoverview gRPC-Web generated client stub for user
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v3.20.3
// source: user.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as user_pb from './user_pb'; // proto import: "user.proto"


export class UserClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorGet = new grpcWeb.MethodDescriptor(
    '/user.User/Get',
    grpcWeb.MethodType.UNARY,
    user_pb.GetRequest,
    user_pb.GetResponse,
    (request: user_pb.GetRequest) => {
      return request.serializeBinary();
    },
    user_pb.GetResponse.deserializeBinary
  );

  get(
    request: user_pb.GetRequest,
    metadata?: grpcWeb.Metadata | null): Promise<user_pb.GetResponse>;

  get(
    request: user_pb.GetRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.GetResponse) => void): grpcWeb.ClientReadableStream<user_pb.GetResponse>;

  get(
    request: user_pb.GetRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: user_pb.GetResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/user.User/Get',
        request,
        metadata || {},
        this.methodDescriptorGet,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/user.User/Get',
    request,
    metadata || {},
    this.methodDescriptorGet);
  }

  methodDescriptorUpdate = new grpcWeb.MethodDescriptor(
    '/user.User/Update',
    grpcWeb.MethodType.UNARY,
    user_pb.UpdateRequest,
    user_pb.UpdateResponse,
    (request: user_pb.UpdateRequest) => {
      return request.serializeBinary();
    },
    user_pb.UpdateResponse.deserializeBinary
  );

  update(
    request: user_pb.UpdateRequest,
    metadata?: grpcWeb.Metadata | null): Promise<user_pb.UpdateResponse>;

  update(
    request: user_pb.UpdateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.UpdateResponse) => void): grpcWeb.ClientReadableStream<user_pb.UpdateResponse>;

  update(
    request: user_pb.UpdateRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: user_pb.UpdateResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/user.User/Update',
        request,
        metadata || {},
        this.methodDescriptorUpdate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/user.User/Update',
    request,
    metadata || {},
    this.methodDescriptorUpdate);
  }

  methodDescriptorDelete = new grpcWeb.MethodDescriptor(
    '/user.User/Delete',
    grpcWeb.MethodType.UNARY,
    user_pb.DeleteRequest,
    user_pb.DeleteResponse,
    (request: user_pb.DeleteRequest) => {
      return request.serializeBinary();
    },
    user_pb.DeleteResponse.deserializeBinary
  );

  delete(
    request: user_pb.DeleteRequest,
    metadata?: grpcWeb.Metadata | null): Promise<user_pb.DeleteResponse>;

  delete(
    request: user_pb.DeleteRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: user_pb.DeleteResponse) => void): grpcWeb.ClientReadableStream<user_pb.DeleteResponse>;

  delete(
    request: user_pb.DeleteRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: user_pb.DeleteResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/user.User/Delete',
        request,
        metadata || {},
        this.methodDescriptorDelete,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/user.User/Delete',
    request,
    metadata || {},
    this.methodDescriptorDelete);
  }

}
