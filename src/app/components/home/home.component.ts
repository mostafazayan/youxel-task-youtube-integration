import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VideosService } from 'src/app/services/videos.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, AfterViewInit {
  videos: any[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'date',
    'thumbnail',
    'rate',
    'actions',
  ];
  x = 5;
  y = 2;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  videosDataSource = new MatTableDataSource(this.videos);
  favoriteItems: any = [];
  isLoading = false;
  isClicked = false;
  cacheKey = 'cacheKey';
  videosPerPage = 3;
  totalResults = 15;
  currentPage = 1;
  pageSize = 3;
  rateItems: any = [];
  currentRate = 0;
  constructor(private videosService: VideosService) {}

  ngOnInit(): void {
    this.getVideos(this.pageSize, this.videosPerPage, this.currentPage);
  }

  ngAfterViewInit(): void {
    this.videosDataSource.sort = this.sort;
  }

  getVideos(pageSize: number, videosPerPage: number, pageIndex: number): void {
    this.pageSize = pageSize;
    this.videosPerPage = videosPerPage;
    this.isLoading = true;
    this.videosService
      .getVideosForChanel(videosPerPage, pageIndex)
      .subscribe((list: any) => {
        localStorage[this.cacheKey] = JSON.stringify(list);
        this.videos = list.items;
        this.videosDataSource = new MatTableDataSource(this.videos);
        this.videosDataSource.paginator = this.paginator;
        this.videosDataSource.sort = this.sort;
        this.isLoading = false;
        console.log(this.videos);
        this.pageSize = list.pageInfo.resultsPerPage;
      });
    this.videos = JSON.parse(localStorage.getItem(this.cacheKey) || '[]');
  }

  onChangedPage(pageData: PageEvent): void {
    console.log(pageData);
    this.getVideos(pageData.pageSize, pageData.length, pageData.pageIndex);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.videosDataSource.filter = filterValue.trim().toLowerCase();

    // if (this.videosDataSource.paginator) {
    //   this.videosDataSource.paginator.firstPage();
    // }
  }

  addToFavorite(video: any): void {
    console.log(video);
    const favoriteDataNull = localStorage.getItem('favorite-videos');
    if (favoriteDataNull == null) {
      const getStoredData: any = [];
      getStoredData.push(video);
      localStorage.setItem('favorite-videos', JSON.stringify(getStoredData));
    } else {
      let index = -1;
      this.favoriteItems = JSON.parse(
        localStorage.getItem('favorite-videos') || '[]'
      );
      for (let i = 0; i < this.favoriteItems.length; i++) {
        // tslint:disable-next-line:radix
        const id = video.id.videoId;
        if (id === this.favoriteItems[i].id.videoId) {
          this.favoriteItems[i].id.videoId = video.id.videoId;
          index = i;
          break;
        }
      }
      if (index === -1) {
        this.favoriteItems.push(video);
        localStorage.setItem(
          'favorite-videos',
          JSON.stringify(this.favoriteItems)
        );
      } else {
        localStorage.setItem(
          'favorite-videos',
          JSON.stringify(this.favoriteItems)
        );
      }
    }
  }
  addRate(video: any): void {
    const oldRatedData: any[] = JSON.parse(
      localStorage.getItem('rated-videos') || '[]'
    );
    const ratedDataNull = localStorage.getItem('rated-videos');
    if (ratedDataNull === null) {
      localStorage.setItem('rated-videos', '[]');
      oldRatedData.push(this.currentRate);

      setTimeout(() => {
        localStorage.setItem('rated-videos', JSON.stringify(oldRatedData));
      }, 1000);
    } else {
      let index = -1;
      this.rateItems = JSON.parse(localStorage.getItem('rated-videos') || '[]');
      for (let i = 0; i < this.rateItems.length; i++) {
        // tslint:disable-next-line:radix
        const id = video.id.videoId;
        if (id === this.rateItems[i].id.videoId) {
          this.rateItems[i].id.videoId = video.id.videoId;
          index = i;
          break;
        }
      }
      if (index === -1) {
        this.rateItems.push(oldRatedData);
        localStorage.setItem('rated-videos', JSON.stringify(this.rateItems));
      } else {
        localStorage.setItem('rated-videos', JSON.stringify(this.rateItems));
      }
    }
  }
}
