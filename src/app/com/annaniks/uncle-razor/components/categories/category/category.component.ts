import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Category } from '../../../views/main/catalog/catalog.models';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItemsService } from '../../../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-category',
    templateUrl: 'category.component.html',
    styleUrls: ['category.component.scss'],

})
export class CategoryComponent implements OnInit, OnDestroy {
    public selectedArray: number[] = [];
    private _isMain: boolean = false
    private _multiSelect: boolean;
    @Input('category') private _category: Category;
    @Input('isCloseMenu') private _isCloseMenu: boolean = false;
    @Input('isParent') private _isParent: boolean = false;
    @Input('isSlideNav') private _isSlideNav: boolean = false;
    @Input('multiSelect')
    set setMultiselectValue($event) {
        this._multiSelect = $event;
    }
    @Input('isMain')
    set setMainValue($event) {
        this._isMain = $event;
    }
    @Output('getSelectsArray') private _selectArr = new EventEmitter;
    private _activeCategory: boolean = false;
    private _unsubscribe: Subject<void> = new Subject<void>();

    constructor(private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _menuItemsService: MenuItemsService
    ) {}

    ngOnInit() {
        this._checkQueryParams();
        this._setIsActiveValue();

    }

    private _setIsActiveValue(): void {
        if (this._category.subCategory.length) {
            for (let category of this._category.subCategory) {
                category['isActive'] = false;
            }
        }
    }

    public onClickSubcategoryButton(item) {
        item.isActive = !item.isActive
    }

    private _checkQueryParams(): void {
        this._activatedRoute.params
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((params) => {
                let flag: boolean = false;
                this._checkMultyQueryParams();
                if (params && params.parentId) {
                    if (params.parentId === this._category.self_slug) {
                        flag = true;
                    }
                }
                if (params && params.lastChildId) {
                    if (params.lastChildId === this._category.self_slug) {
                        if (this._multiSelect) {
                            if (!this._category.subCategory.length) {
                                flag = false
                            } else {
                                flag = true;
                            }
                        } else {
                            flag = true;
                        }
                    }
                    else {
                        if (this.category.subCategory)
                            this.category.subCategory.forEach((element) => {
                                if (element.self_slug === params.lastChildId) {
                                    flag = true;
                                    element.isActive = true;
                                } else {
                                    element.isActive = false
                                }
                                if (element.subCategory) {
                                    element.subCategory.forEach((subcategory) => {
                                        if (subcategory.self_slug == params.lastChildId) {
                                            flag = true;
                                            element.isActive = true;
                                        }
                                    })
                                }
                            })
                    }
                }
                this._activeCategory = flag;
            })
    }

    public onClickButton(): void {
        this._activeCategory = !this._activeCategory;
    }
    private _checkMultyQueryParams() {
        let queryParams = this._activatedRoute.snapshot.queryParams;
        if (queryParams && queryParams.filter) {
            let filter = JSON.parse(queryParams.filter)
            if (filter && filter["categoryId"]) {
                let queryArr = filter["categoryId"].split(',');
                if (this._category.subCategory.length) {
                    for (let subcategory of this._category.subCategory) {
                        for (let arr of queryArr) {
                            if (subcategory.id == arr) {
                                this.selectedArray.push(parseInt(arr));
                                this._selectArr.emit(this.selectedArray)
                            }
                        }
                    }
                } else {
                    for (let arr of queryArr) {
                        if (this._category.id == arr) {
                            this.selectedArray.push(parseInt(arr));
                            this._selectArr.emit(this.selectedArray)
                        }
                    }
                }
            }
        }
    }
    public onClickCategory(category: Category, isParent?: boolean): void {
        if (this._multiSelect) {
            category.isSelect = !category.isSelect;
            if (category.isSelect) {
                this.selectedArray.push(category.id);
            } else {
                for (let i = 0; i < this.selectedArray.length; i++) {
                    if (this.selectedArray[i] == category.id) {
                        this.selectedArray.splice(i, 1)
                    }
                }
            }
            this._selectArr.emit(this.selectedArray)
        } else {
            if (this._isCloseMenu && this._menuItemsService.getOpenMenu()) {
                this._menuItemsService.openMenu();
            }
            // let params = {};
            // if (isParent) {
            //     params = { parentcategoryname: category.name, parentcategoryid: category.id, page: 1 };
            // }
            // else {
            //     if (this._isSlideNav) {
            //         params = { parentcategoryname: this._category.name, parentcategoryid: this._category.id, categoryname: category.name, categoryid: category.id, page: 1, filter: JSON.stringify({ categoryId: category.id.toString() }) };
            //     }
            //     else {
            //         params = { categoryname: category.name, categoryid: category.id, page: 1, filter: JSON.stringify({ categoryId: category.id.toString() }) };
            //     }
            // }
            this._router.navigate([`/category/${category.slug}`], { relativeTo: this._activatedRoute, queryParamsHandling: 'merge' });
        }
    }

    get category(): Category {
        return this._category;
    }

    get isSlideNav(): boolean {
        return this._isSlideNav
    }

    get activeCategory(): boolean {
        return this._activeCategory;
    }

    get isParent(): boolean {
        return this._isParent;
    }

    get multiSelect(): boolean {
        return this._multiSelect
    }

    get isMain(): boolean {
        return this._isMain
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

}