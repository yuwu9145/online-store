import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Product } from '../../models/product';
import { Observable } from 'rxjs/Observable';
import { HttpCallsService } from '../http-calls/http-calls.service';

@Injectable()
export class ProductsService {

  constructor(private httpCallsService: HttpCallsService) { }

  getAllProducts(): Observable<any> {

    return this.httpCallsService.getRequest('product/all');
  }
}