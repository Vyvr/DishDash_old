import { ClientReadableStream, Metadata, RpcError } from 'grpc-web';
import { Observable } from 'rxjs';

type ToObject = { toObject: () => any };

type HandleRequestFunc<Request, Response> = (
  request: Request,
  metadata: Metadata | null,
  callback: (err: RpcError, response: Response) => void
) => ClientReadableStream<Response>;

export function handleRequest<
  Request,
  Response extends ToObject,
  ResponseObject
>(
  request: Request,
  func: HandleRequestFunc<Request, Response>,
  metadata: Metadata | null = null
): Observable<ResponseObject> {
  return new Observable<ResponseObject>((observer) => {
    func(request, metadata, (err, response) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(response.toObject());
      }
      observer.complete();
    });
  });
}

// @TODO: to future Maciej - fuck you :)
/**
 * Binds a payload object to a given request.
 * This function iterates over each property of the payload, capitalizes the first letter of the property name,
 * and then calls a setter method on the request object using this modified property name.
 *
 * @param {any} request - The request object to which the payload properties will be bound.
 *                         It should have setter methods corresponding to the payload's properties.
 * @param {any} payload - The payload object containing properties to be bound to the request.
 */
export function bindPayloadToRequest(request: any, payload: any): void {
  Object.keys(payload).forEach((prop) => {
    const propName = [prop.charAt(0).toUpperCase(), ...prop.slice(1)].join('');

    request?.[`set${propName}`](payload[prop]);
  });
}
