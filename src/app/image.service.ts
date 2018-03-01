import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Auth, Note, Directory, Share } from './entities';
import { LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CaptureAudioOptions, MediaCapture, MediaFile } from '@ionic-native/media-capture';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer';

export interface ImageResult {
  code: number;
  msg?: string;
  url?: string;
}

export interface RecognizeResult {
  code: number;
  msg?: string;
  result?: string;
}

@Injectable()
export class ImageService {

    private headers = new Headers();

    private transferObj: FileTransferObject;

    private cameraOpt:CameraOptions = {
      quality: 50,
      destinationType: this.camare.DestinationType.FILE_URI,
      sourceType: this.camare.PictureSourceType.CAMERA,
      encodingType: this.camare.EncodingType.JPEG,
      mediaType: this.camare.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum: true,
    };
    // 调用相册时传入的参数
    private imagePickerOpt: ImagePickerOptions = {
      maximumImagesCount: 1,//选择一张图片
      width: 800,
      height: 800,
      quality: 80,
      outputType: this.camare.DestinationType.FILE_URI
    };
    //录音配置
    private audioCaptureOpt: CaptureAudioOptions = {
      limit: 1,
      duration: 10
    }
    //文件上传配置
    private fileTransferOpt: FileUploadOptions = {
      fileKey: 'file',
    };

    constructor(public http: Http, @Inject('auth') private authService, @Inject('notice') private noticeService,
    public loadingCtrl: LoadingController, private imagePicker: ImagePicker,
    private camare: Camera, private mediaCapture: MediaCapture, private fileTransfer: FileTransfer) {
        // this.headers.set('Content-Type', 'application/json');
        this.transferObj = fileTransfer.create();
        this.authService.getAuth().subscribe((auth: Auth) => {
            this.headers.set('Authorization', auth.token);
        });
    }

    public selectPortraitByImagePicker(): Promise<ImageResult> {
      const imageResult: ImageResult =  {
        code: 50000,
        msg: '',
        url: ''
      };
      return new Promise<ImageResult>((resolve, reject) => {
        this.imagePicker.getPictures(this.imagePickerOpt).then(results => {
          if (results && results.length === 1) {
            this.noticeService.showLoading('更换头像中...');
            const filePath: string = results[0];
            this.transferObj.upload(filePath, 'http://localhost:8080/tps/upload', this.fileTransferOpt)
            .then((result: FileUploadResult) => {
              this.noticeService.hideLoading();
              const res = JSON.parse(result.response);
              if (res.code === 20000) {
                imageResult.code = 20000;
                imageResult.url = res.url;
                imageResult.msg = '';
                resolve(imageResult);
              }else {
                imageResult.code = res.code;
                imageResult.msg = res.msg;
                imageResult.url = '';
                reject(imageResult);
              }
            }, err => {
              this.noticeService.hideLoading();
              imageResult.msg = err;
              imageResult.url = '';
              reject(imageResult);
            });
          }else {
            this.noticeService.hideLoading();
            imageResult.msg = '只能选择一张图片';
            imageResult.url = '';
            reject(imageResult);
          }
        }, err => {
          this.noticeService.hideLoading();
          imageResult.msg = err;
          imageResult.url = '';
          reject(imageResult);
        })
      });
    }

    public selectPortraitByCamera(): Promise<ImageResult> {
      const imageResult: ImageResult =  {
        code: 50000,
        msg: '',
        url: ''
      }
      return new Promise<ImageResult>((resolve, reject) => {
        this.camare.getPicture(this.cameraOpt).then(filePath => {
          this.noticeService.showLoading('更换头像中...');
          this.transferObj.upload(filePath, 'http://localhost:8080/tps/upload', this.fileTransferOpt)
          .then((result: FileUploadResult) => {
            this.noticeService.hideLoading();
            const res = JSON.parse(result.response);
            if (res.code === 20000) {
              imageResult.code = 20000;
              imageResult.url = res.url;
              imageResult.msg = '';
              resolve(imageResult);
            }else {
              imageResult.code = res.code;
              imageResult.msg = res.msg;
              imageResult.url = '';
              reject(imageResult);
            }
          }, err => {
            this.noticeService.hideLoading();
            imageResult.msg = err;
            imageResult.url = '';
            reject(imageResult);
          });
        }, err => {
          this.noticeService.hideLoading();
          imageResult.msg = err;
          imageResult.url = '';
          reject(imageResult);
        });
      });
    }

    public ocr(): Promise<RecognizeResult> {
      const recognizeResult: RecognizeResult =  {
        code: 50000,
        msg: '',
        result: '',
      }
      return new Promise<ImageResult>((resolve, reject) => {
        this.camare.getPicture(this.cameraOpt).then(filePath =>{
          this.noticeService.showLoading('字符识别中...');
          const uploadOpt = Object.assign({}, this.fileTransferOpt);
          uploadOpt.fileKey = 'imageFile';
          this.transferObj.upload(filePath, 'http://localhost:8080/tps/upload', uploadOpt)
          .then((result: FileUploadResult) => {
            this.noticeService.hideLoading();
            const res = JSON.parse(result.response);
            if (res.code === 20000) {
              recognizeResult.code = 20000;
              recognizeResult.result = res.content;
              recognizeResult.msg = '';
              resolve(recognizeResult);
            }else {
              recognizeResult.code = res.code;
              recognizeResult.msg = res.msg;
              recognizeResult.result = '';
              reject(recognizeResult);
            }
          }, err => {
            this.noticeService.hideLoading();
            recognizeResult.msg = err;
            recognizeResult.result = '';
            reject(recognizeResult);
          });
        }, err => {
          this.noticeService.hideLoading();
          recognizeResult.msg = err;
          recognizeResult.result = '';
          reject(recognizeResult);
        })
      });
    }

    public speech(): Promise<RecognizeResult> {
      const recognizeResult: RecognizeResult =  {
        code: 50000,
        msg: '',
        result: '',
      }
      return new Promise<RecognizeResult>((resolve, reject) => {
        this.mediaCapture.captureAudio().then((files: MediaFile[]) => {
          if (files && files.length == 1) {
            const filePath = files[0].fullPath;
            this.noticeService.showLoading('语音识别中...');
            const uploadOpt = Object.assign({}, this.fileTransferOpt);
            uploadOpt.fileKey = 'audioFile';
            uploadOpt.fileName = files[0].name;
            this.transferObj.upload(filePath, 'http://localhost:8080/tps/upload', uploadOpt)
            .then((result: FileUploadResult) => {
              this.noticeService.hideLoading();
              const res = JSON.parse(result.response);
              if (res.code === 20000) {
                recognizeResult.code = 20000;
                recognizeResult.result = res.content;
                recognizeResult.msg = '';
                resolve(recognizeResult);
              }else {
                recognizeResult.code = res.code;
                recognizeResult.msg = res.msg;
                recognizeResult.result = '';
                reject(recognizeResult);
              }
          }, err => {
              this.noticeService.hideLoading();
              recognizeResult.msg = err;
              recognizeResult.result = '';
              reject(recognizeResult);
            });
          }else {
            this.noticeService.hideLoading();
            recognizeResult.msg = '只能上传一段录音';
            recognizeResult.result = '';
            reject(recognizeResult);
          }
        }).catch(err => {
          this.noticeService.hideLoading();
          recognizeResult.msg = err;
          recognizeResult.result = '';
          reject(recognizeResult);
        });
      });
    }

}