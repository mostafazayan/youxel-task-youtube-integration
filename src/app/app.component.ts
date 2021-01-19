import { Component, OnInit, ViewChild } from '@angular/core';
import { VideosService } from './services/videos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'yoxel-task';
  update = false;

  constructor(updates: SwUpdate) {
    updates.available.subscribe((event) => {
      // this.update = true;
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  ngOnInit(): void {}
}
