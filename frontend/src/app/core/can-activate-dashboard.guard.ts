import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, interval, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanActivateDashboard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return interval(2500).pipe(map(() => true));
  }
}
