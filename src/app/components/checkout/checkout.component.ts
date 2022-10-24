import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;
  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private shopFormService: ShopFormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get shippingStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditName() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditSecurity() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  createFormGroup() {
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9_.]+@[a-z0-9]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          ShopValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}$'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
  }

  setshopForm() {
    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });

    this.shopFormService.getCreditCardYears().subscribe((data) => {
      this.creditCardYears = data;
    });

    this.shopFormService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }
  reviewCardDetail() {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }
  ngOnInit(): void {
    this.createFormGroup();
    this.setshopForm();
    this.reviewCardDetail();
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    const order = new Order(this.totalPrice, this.totalQuantity);
    const orderItems: OrderItem[] = this.cartService.cartItems.map(
      (item) => new OrderItem(item)
    );

    const shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;

    shippingAddress.country = shippingAddress.country.name;
    shippingAddress.state = shippingAddress.state.name;
    billingAddress.country = billingAddress.country.name;
    billingAddress.state = billingAddress.state.name;

    const purchase = new Purchase(
      this.checkoutFormGroup.controls['customer'].value,
      shippingAddress,
      billingAddress,
      order,
      orderItems
    );
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (res) => {
        console.log(
          `Your order has been received.\nOrder tracking Number: ${res.orderTrackingNumber}`
        );
        this.resetCart();
      },
      error: (err) => {
        console.log(`There was an error: ${err.message}`);
      },
    });
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl('/products');
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    this.shopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress')
        this.shippingAddressStates = data;
      else this.billingAddressStates = data;

      formGroup?.get('state')?.setValue(data[0]);
    });
  }
  copyShippingAddress(_event: any) {
    if (_event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  handleDay() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear = new Date().getFullYear();
    const selectedYear = creditCardFormGroup?.value.expirationYear;
    let StartMonth: number;
    if (currentYear === +selectedYear) {
      StartMonth = new Date().getMonth() + 1;
    } else {
      StartMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(StartMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }
}
