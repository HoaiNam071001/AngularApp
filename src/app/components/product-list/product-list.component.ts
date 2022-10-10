import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId!: number;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
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
      .searchProducts(keyword)
      .subscribe((data) => (this.products = data));
  }
  handleListProduct() {
    const hasCategoryId: boolean = this.hasParam('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.getParam('id')!;
    } else this.currentCategoryId = 1;

    this.productService
      .getProductList(this.currentCategoryId)
      .subscribe((data) => (this.products = data));
  }
}
