import { Observable } from 'rxjs';

export function base64ToBlob(base64: string, contentType: string): Blob {
  // Decode base64 string
  const binaryString = window.atob(base64);
  // Create a Uint8Array from binary string
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Create and return a Blob from the Uint8Array
  return new Blob([bytes], { type: contentType });
}

export function getBase64String$(file: Blob): Observable<string> {
  return new Observable<string>((observer) => {
    const reader = new FileReader();

    // @TODO: add proper type
    reader.onload = (event: any) => {
      observer.next(event.target?.result as string);
      observer.complete();
    };
    reader.onerror = (error) => observer.error(error);

    reader.readAsDataURL(file);
  });
}
