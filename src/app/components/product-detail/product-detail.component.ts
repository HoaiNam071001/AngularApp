import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.handleProductDetail();
    });
  }
  handleProductDetail() {
    const ProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService
      .getProductDetail(ProductId)
      .subscribe((data) => (this.product = data));
  }
}
