import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as S3 from 'aws-sdk/clients/s3';
import { concat } from 'rxjs/observable/concat';

import * as fromModel from '../../models/index';
import { HttpCallsService } from '../http-calls/http-calls.service';
import { AppConfigService } from '../app-config/app-config-service.service';

@Injectable()
export class FileService {

  private bucketName;

  constructor(
    private httpCallsService: HttpCallsService,
    private appConfig: AppConfigService
  ) {
    this.bucketName = 'phonecase-store-app-assets';
  }

  uploadFile(file: File): Observable<any> {
    return this.httpCallsService.postRequest(`file/upload`, file);
  }

  uploadFiles(files: fromModel.UploadFile[]): Observable<any> {

    const fileUploadObservablesArray: Observable<any>[] = (
      files.map((file: fromModel.UploadFile) => {

        const bucket = new S3({
          accessKeyId: this.appConfig.config.S3.accessKeyId,
          secretAccessKey: this.appConfig.config.S3.secretAccessKey,
          region: this.appConfig.config.S3.region
        });

        const params = {
          Bucket: this.bucketName,
          Key: file.name,
          Body: file,
          ACL: 'public-read'
        };

        return Observable.create(observer => {
          bucket.upload(params, function (err, data) {
            if (err) {
              console.error(`There was an error uploading your file: ${err}`);
              observer.error(`There was an error uploading your file: ${err}`);
            }

            observer.next(data.Location);
            observer.complete();
          })
          .on('httpUploadProgress', progress => {
            const progressPercentage: number = progress.total ? progress.loaded * 100 / progress.total : 0;
            file.uploadProgress = progressPercentage;
            observer.next(file);
          });
        });
      })
    );

    return concat(...fileUploadObservablesArray);
  }
}
