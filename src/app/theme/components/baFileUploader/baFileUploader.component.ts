import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, SimpleChanges } from '@angular/core';
import {FileUploader, FileLikeObject} from 'ng2-file-upload';
declare var $:any;
@Component({
  selector: 'ba-file-uploader',
  styleUrls: ['./baFileUploader.scss'],
  templateUrl: './baFileUploader.html',
})
export class BaFileUploader {
  @Input() fileUploaderOptions:any;
  @Output() onFileUpload = new EventEmitter<any>();
  @Output() onFileUploadCompleted = new EventEmitter<any>();
  @Input() defaultValue: string = '';

  @ViewChild('fileUpload') public _fileUpload: ElementRef;
  @ViewChild('inputText') public _inputText: ElementRef;

  uploader: FileUploader;
  public uploadFileInProgress: boolean;

  constructor(private renderer: Renderer) {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:',changes);
    if(changes.uploaderOptions){
      this.initializeUploader();
    }
  }

  initializeUploader(){
    this.uploader = new FileUploader(this.fileUploaderOptions);
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      //response = JSON.parse(response);
      if (status === 200) {
        if (item.isSuccess) {
        }
      }
    };

    this.uploader.onProgressItem = () => {
      this.uploadFileInProgress = true;
    };

    this.uploader.onCompleteAll = () => {
      this.uploadFileInProgress = false;
    };
  }

  bringFileSelector(): boolean {
    this.renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
    return false;
  }

  beforeFileUpload(uploadingFile): void {
    let files = this._fileUpload.nativeElement.files;
    if (files.length) {
      const file = files[0];
      this._onChangeFileSelect(files[0])
      if (!this._canFleUploadOnServer()) {
        uploadingFile.setAbort();
      } else {
        this.uploadFileInProgress = true;
      }
    }
  }

  _onChangeFileSelect(file) {
    this._inputText.nativeElement.value = file.name
  }

  _onFileUpload(data): void {
    if (data['done'] || data['abort'] || data['error']) {
      this._onFileUploadCompleted(data);
    } else {
      this.onFileUpload.emit(data);
    }
  }

  _onFileUploadCompleted(data): void {
    this.uploadFileInProgress = false;
    this.onFileUploadCompleted.emit(data);
  }

  _canFleUploadOnServer(): boolean {
    return !!this.fileUploaderOptions['url'];
  }
}
