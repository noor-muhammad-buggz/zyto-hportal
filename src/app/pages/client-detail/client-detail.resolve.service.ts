import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ZytoService } from '../../services/zyto.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ClientResolve implements Resolve<any> {

  constructor(private zytoService: ZytoService) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.zytoService.GetClientById(route.params.id).then(user => user);
  }

}
