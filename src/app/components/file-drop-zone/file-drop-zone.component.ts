import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import * as fromService from '../../services';

import * as fromModel from '../../models/index';

@Component({
  selector: 'app-file-drop-zone',
  templateUrl: './file-drop-zone.component.html',
  styleUrls: ['./file-drop-zone.component.scss']
})
export class FileDropZoneComponent implements OnInit {

  fileList: Array<fromModel.UploadFile> = [];

  @Input()
  existingFiles: string[] = [];

  @Output()
  finalFileList: string[] = [];

  constructor(
    private fileService: fromService.FileService
  ) {
    // this.finalFileList = this.existingFiles;
    console.log('---------in constructor--------', this.fileList);
  }

  ngOnInit() {}

  onDrop(event: DragEvent) {
    event.preventDefault();
    const droppedFiles: Array<fromModel.UploadFile> = Object.keys(event.dataTransfer.files).map(key => event.dataTransfer.files[key]);
    droppedFiles.forEach(file => file.id = Math.random().toString(36).substr(2, 9));
    this.fileList = this.fileList.length
    ? [...this.fileList, ...droppedFiles] : droppedFiles;
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  uploadAllFiles(event: Event) {
    event.preventDefault();
    const uploadingFiles = Object.assign([], this.fileList.filter(file => file instanceof File));

    this.fileService.uploadFiles(uploadingFiles).subscribe(val => {
      console.log('------subscribe--------', val);
      console.log('------file list--------', this.fileList);
    });
  }
}
