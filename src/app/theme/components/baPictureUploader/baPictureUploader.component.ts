import {Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, SimpleChanges} from '@angular/core';
import { GlobalState } from '../../../global.state';
import { ZytoService } from '../../../services/zyto.service';

import {FileUploader, FileLikeObject} from 'ng2-file-upload';
declare var $:any;

@Component({
  selector: 'ba-picture-uploader',
  styleUrls: ['./baPictureUploader.scss'],
  templateUrl: './baPictureUploader.html',
})
export class BaPictureUploader {

  @Input() defaultPicture:string = '';
  @Input() picture:string = '';

  @Input() uploaderOptions:any;
  @Input() canDelete:boolean = true;

  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();
  @Output() onPictureChange = new EventEmitter<any>();

  @ViewChild('fileUpload') public _fileUpload:ElementRef;

  public uploadInProgress:boolean;
  uploader: FileUploader;

  constructor(public globalState: GlobalState,private renderer: Renderer,private zytoService: ZytoService,) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:',changes);
    if(changes.uploaderOptions){
      this.initializeUploader();
    }
  }

  initializeUploader(){
    console.log('Upload startttttttttt');
    this.uploader = new FileUploader(this.uploaderOptions);
    this.uploader.onWhenAddingFileFailed = (item, filter, options) =>
    this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onAfterAddingFile = item => this.onAfterAddingFile(item);
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (status === 200) {
        if (item.isSuccess) {
          // console.log('asdasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        }
      }
      const resp = JSON.parse(response);
      console.log(resp);
      localStorage.setItem("AccounteTag", resp.ETag);
      // console.log(response);
    };

    this.uploader.onProgressItem = () => {
      this.uploadInProgress = true;
    };

    this.uploader.onCompleteAll = () => {
      // console.log('asdasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      this.uploadInProgress = false;
      this.globalState.showLoader = false;
    };
  }

  pictureChangeEvent($event){
    setTimeout(() => {
      if (this.uploader.queue.length > 0) {
        this.globalState.showLoader = true;
        //console.log('this.uploader:',this.uploader);
        //this.uploader.uploadAll();
        this.uploader.queue.forEach((item, index) => {
          item.withCredentials = false;
          console.log("item:", item);
          item.upload();
          //console.log('item.isUploading:' + item.isUploading);
        });
        this._fileUpload.nativeElement.value = '';
      }
    }, 100);
  }

  bringFileSelector():boolean {
    this.renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
    return false;
  }

  removePicture():boolean {
    if (confirm('Are you sure you want to remove the image?')) {
      this.picture = '';
      const self = this;
      this.globalState.showLoader = true;
      this.zytoService.deleteImage().subscribe(response => {
        // this.states = response;
        this.picture = null;
        this.globalState.showLoader = false;
        this.globalState.showMessage('success','Picture Deleted successfully','Picture Deleted');
        // img.picture = this.profile.profile;
        // const url = self.router.url;
        // self.router.navigate(['pages/account']);
      }, error => {
        this.globalState.showMessage('error', (error.Message) ? error.Message : error["0"].Message, 'Error');
        this.globalState.showLoader = false;
      });
      return false;
    }

  }

  previewInputImage(file:File):void {
    const reader = new FileReader();
    reader.addEventListener('load', (event:Event) => {
      this.picture = (<any> event.target).result;
    }, false);
    reader.readAsDataURL(file);
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    console.log('in onWhenAddingFileFailed');
    let errorMessage;
    switch (filter.name) {
      case "fileSize":
        //let limitSizeMB = Math.round(this.maxFileSize / (1024 * 1024));
        //let actualSizeMB = Math.round(item.size / (1024 * 1024));
        errorMessage = `Maximum upload size exceeded (6 MB allowed)`;
        break;
      case "mimeType":
        const allowedTypes = this.uploaderOptions.allowedMimeType.join();
        errorMessage = `Type "${
          item.type
        } is not allowed. Allowed types: "${allowedTypes}"`;
        break;
      case "imageDimension":
        errorMessage = `Dimension Exceeded - Allowed Image dimension are 5000px(w) x 5000px(h)`;
        break;
      default:
        errorMessage = `Unknown error (filter is ${filter.name})`;
    }
    this.globalState.showMessage('error',errorMessage, 'Error');
    //this.productImage = null;
    $('#fileInput').val('');
  }

  onAfterAddingFile(fileItem) {
    this.getImageDimension(fileItem._file).then((imgFile) => {
      if(imgFile.naturalWidth > this.uploaderOptions.maxWidth || imgFile.naturalHeight > this.uploaderOptions.maxHeight){

        let errorMessage = `Dimension Exceeded - Allowed Image dimension are 5000px(w) x 5000px(h)`;
        this.globalState.showMessage('error',errorMessage, 'Error');
        this.uploader.removeFromQueue(fileItem);
        //this.productImage = null;
        $('#fileInput').val('');
      }else{
        this.previewInputImage(fileItem._file);
      }
    }).catch((error) => {
      this.uploader.removeFromQueue(fileItem);
      //this.productImage = null;
      $('#fileInput').val('');
    })
  }

  getImageDimension(imageFile): Promise<any> {
    return new Promise(function (resolve, reject) {
      const fr = new FileReader;
      fr.onload = function () {
        const image = new Image();
          image.onload = function () {
              resolve(image);
          };
          image.onerror = function (error) {
            reject(error);
          }
          image.src = fr.result;
      };
      fr.onerror = function (error) {
        reject(error);
      }
      fr.readAsDataURL(imageFile);
    });
  }
}
