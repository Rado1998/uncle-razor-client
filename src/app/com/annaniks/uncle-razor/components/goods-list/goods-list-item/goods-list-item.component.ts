import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { Product, ProductScore } from '../../../models/models';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MainService } from '../../../views/main/main.service';

@Component({
    selector: 'app-goods-list-item',
    templateUrl: 'goods-list-item.component.html',
    styleUrls: ['goods-list-item.component.scss']
})
export class GoodsListItemComponent implements OnInit {
    private _productRating: number = 0;
    public isHit: boolean = false;
    public isNew: boolean = false;
    public isSale: boolean = false;
    public isBarbersize: boolean = false;
    public isMusthave: boolean = false;
    public salePrice:number=0
    @Input('product') _product: Product = new Product();
    @Input('style') style;
    constructor(
        @Inject('FILE_URL') private _fileUrl: string,
        private _router: Router,
        private _titleService: Title,
        private _mainService: MainService
    ) { }

    ngOnInit() {
        this._calcProductRating(this._product.productScore);
        this._getStatusProducts()
    }
    private _getStatusProducts() {
        if(this._product.specificPrice){
            this.isSale=true;
            let specificPrice=+this._product.specificPrice;
            let realPrice=+this._product.price_with_vat;
            this.salePrice=+(100*(realPrice-specificPrice)/realPrice).toFixed(2)
        }
        if (this._product && this._product.status)
            for (let status of this._product.status) {
                switch (status.name) {
                    case 'Популярные': {
                        this.isHit = true;
                        break
                    }
                    case 'Новинки': {
                        this.isNew = true;
                        break
                    }                  
                    case 'Спецпредложения': {
                        this.isMusthave = true;
                        break
                    }
                    case 'Barber Size': {
                        this.isBarbersize = true;
                        break
                    }
                }
            }
    }
    private setProductToBasket(product): void {
        product['count'] = 1;
        this._mainService.addProductBasket(product)
    }

    private _calcProductRating(ratings: ProductScore[]): void {
        if (ratings) {
            ratings.forEach((element) => {
                this._productRating += +element.score
            })
            if (ratings.length > 0) {
                this._productRating = this._productRating / ratings.length;
            }
        }
    }

    private _setProductRating(starCount: number): void {
        this._mainService.setProductRating(starCount, this._product.id).subscribe((data) => { })
    }

    public onClickItem(): void {
        this._router.navigate([`/catalog/${this._product.id}`])
        this._titleService.setTitle(this._product.name);
    }

    public onClickAddBasket(): void {
        this.setProductToBasket(this._product);
    }

    public handleSetRating(event): void {
        this._setProductRating(event)
    }

    public onMouseEnter(): void {

    }

    get product(): Product {
        return this._product;
    }

    get fileUrl(): string {
        return this._fileUrl;
    }

    get productRating(): number {
        return this._productRating
    }
}