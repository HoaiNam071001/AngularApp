import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId!: number;
  previousCategoryId: number = 1;

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.listProducts();
    });
  }
  hasParam(key: string): boolean {
    return this.route.snapshot.paramMap.has(key);
  }
  getParam(key: string): string | null {
    return this.route.snapshot.paramMap.get(key);
  }
  listProducts() {
    const searchMode: boolean | undefined = this.hasParam('keyword');
    if (searchMode) {
      this.handleSearchProduct();
    } else this.handleListProduct();
  }
  handleSearchProduct() {
    const keyword: string = this.getParam('keyword')!;
    this.productService
      .searchPaginate(this.thePageNumber - 1, this.thePageSize, keyword)
      .subscribe(this.ProductResult());
  }
  handleListProduct() {
    const hasCategoryId: boolean = this.hasParam('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.getParam('id')!;
    } else this.currentCategoryId = 1;

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.ProductResult());
  }
  private ProductResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  doPageSize(pagesize: string) {
    this.thePageSize = +pagesize;
    this.listProducts();
  }
  addToCart(product: Product) {
    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
  }
}
