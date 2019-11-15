import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../views/main/catalog/catalog.models';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: 'categories.component.html',
    styleUrls: ['categories.component.scss'],

})
export class CategoriesComponent implements OnInit {
    public selectedSubcategory: any[] = [];
    public params: { categoryId: string } = {} as { categoryId: string };
    @Input('categories') private _categories: Category[] = [];
    @Input('isCloseMenu') private _isCloseMenu: boolean = false;
    @Input('isParent') private _isParent: boolean = false;
    @Input('isSlideNav') private _isSlideNav: boolean = false;
    @Input('isBorder') private _isBorder: boolean = false;
    @Input('multiSelect') private _multiSelect: boolean;
    @Input('isMain') private _isMain: boolean = false
    @Output('getSelectsArray') private _selectArr = new EventEmitter();
    private _unsubscribe$: Subject<void> = new Subject<void>();

    constructor(private _activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this._checkRouteParams();
    }

    private _checkRouteParams(): void {
        this._activatedRoute.params
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((params: { categoryId: string }) => {
                this.params = params;
            })
    }

    public selectedArray(ev, item): void {
        let isExist: boolean = false
        for (let i = 0; i < this.selectedSubcategory.length; i++) {
            if (item.name == Object.keys(this.selectedSubcategory[i])) {
                this.selectedSubcategory[i] = { [item.name]: ev };
                isExist = true
            }
        }
        if (!isExist) {
            this.selectedSubcategory.push({ [item.name]: ev });
        }
        this._selectArr.emit(this.selectedSubcategory)
    }

    get categories(): Array<object> {
        return this._categories;
    }

    get isCloseMenu(): boolean {
        return this._isCloseMenu;
    }

    get isParent(): boolean {
        return this._isParent;
    }

    get isSlideNav(): boolean {
        return this._isSlideNav;
    }
    get isBorder(): boolean {
        return this._isBorder;
    }
    get multiSelect(): boolean {
        return this._multiSelect
    }
    get isMain(): boolean {
        return this._isMain
    }

    ngOnDestroy(){
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}