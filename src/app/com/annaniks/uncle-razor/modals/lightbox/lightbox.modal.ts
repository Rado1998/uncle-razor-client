import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { PlatformService } from '../../services/platform.service';

@Component({
    selector: 'lightbox-modal',
    templateUrl: 'lightbox.modal.html',
    styleUrls: ['lightbox.modal.scss']
})
export class LightboxModal implements OnInit {
    private _currentIndex: number;
    private _currentImage: string;
    public startIndex: number
    public config: SwiperConfigInterface;
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<LightboxModal>,
        @Inject('FILE_URL') private _fileUrl: string,
        private _platformService: PlatformService
    ) {
        this.startIndex = this._data.imageIndex;
        this.config = {
            direction: 'horizontal',
            slidesPerView: this._data.imageIndex,
            keyboard: true,
            mousewheel: true,
            scrollbar: false,
            navigation: true,
            pagination: true,
            zoom: false,
            breakpoints: {
                640: {
                    slidesPerView: 1,
                }
            }
        };
    }

    ngOnInit() {
        if (this._platformService.isBrowser)
            document.body.style.overflow = 'hidden';
        this._currentIndex = this._data.imageIndex;
        this._currentImage = this._data.images[this._data.imageIndex].image;
    }
    public close() {
        if (this._platformService.isBrowser)
            document.body.style.overflow = 'auto';
        this._dialogRef.close()
    }
    public getImage(image?) {
        let styles = {}
        styles["background-image"] = "url(" + this.fileUrl + 'products/' + image.image + ")";
        styles["height"] = window.innerHeight + 'px'
        styles["width"] = window.innerWidth + 'px';
        return styles
    }
    public onClickArrow(event: string) {
        if (event == 'next') {
            if (this._currentIndex == this._data.images.length - 1) {
                this._currentIndex = 0;
            }
            else {
                this._currentIndex++;
            }
            this._currentImage = this._data.images[this._currentIndex].image;


        }
        if (event == 'pervious') {
            if (this._currentIndex == 0) {
                this._currentIndex = this._data.images.length - 1;
            }
            else {
                this._currentIndex--;
            }
            this._currentImage = this._data.images[this._currentIndex].image;
        }
    }

    get images(): string[] {
        return this._data.images;
    }

    get imageIndex(): number {
        return this._data.imageIndex;
    }

    get currentImage(): string {
        return this._currentImage;
    }

    get fileUrl(): string {
        return this._fileUrl;
    }

}