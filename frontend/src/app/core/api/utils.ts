import { ClientReadableStream, Metadata, RpcError } from "grpc-web";
import { Observable } from "rxjs";

type ToObject = { toObject: () => any };

type HandleRequestFunc<Request, Response> = (
  request: Request,
  metadata: Metadata | null,
  callback: (err: RpcError, response: Response) => void
) => ClientReadableStream<Response>;

export function handleRequest<Request, Response extends ToObject, ResponseObject>(
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