import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { map, Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';
const Url = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = `${Url}/api/products`;
  private categoryUrl: string = `${Url}/api/product_category`;
  constructor(private httpClient: HttpClient) {}

  // getProductList(theCategoryId: number): Observable<Product[]> {
  //   const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
  //   return this.getProduct(searchUrl);
  // }

  getProductListPaginate(
    thePage: number,
    thePageSize: number,
    theCategoryId: number
  ): Observable<GetResponseProducts> {
    const searchUrl =
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchPaginate(
    thePage: number,
    thePageSize: number,
    keyword: string
  ): Observable<GetResponseProducts> {
    const searchUrl =
      `${this.baseUrl}/search/findByNameContaining?name=${keyword}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((res) => res._embedded.productCategory));
  }

  // searchProducts(keyword: string): Observable<Product[]> {
  //   const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
  //   return this.getProduct(searchUrl);
  // }

  // getProduct(searchUrl: string): Observable<Product[]> {
  //   return this.httpClient
  //     .get<GetResponseProducts>(searchUrl)
  //     .pipe(map((res) => res._embedded.products));
  // }

  getProductDetail(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProducts {
  _embedded: { products: Product[] };
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

interface GetResponseProductCategory {
  _embedded: { productCategory: ProductCategory[] };
}
