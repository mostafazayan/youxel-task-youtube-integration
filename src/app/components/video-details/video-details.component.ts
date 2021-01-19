import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideosService } from 'src/app/services/videos.service';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
})
export class VideoDetailsComponent implements OnInit {
  VideoId: any;
  VideoData: any;
  isLoading = false;
  favoriteItems: any = [];
  isCheckedAsFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideosService
  ) {}

  ngOnInit(): void {
    this.VideoId = this.route.snapshot.paramMap.get('id');
    this.getVideoData(this.VideoId);
    console.log(this.VideoId);
    this.checking();
  }

  getVideoData(id: any): void {
    this.isLoading = true;
    this.videoService.getVideoDetails(id).subscribe((response: any) => {
      this.VideoData = response.items;
      this.isLoading = false;
      console.log(response);
    });
  }

  checking(): void {
    this.favoriteItems = JSON.parse(
      localStorage.getItem('favorite-videos') || '[]'
    );
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.favoriteItems.length; i++) {
      // tslint:disable-next-line:radix
      if (this.VideoId === this.favoriteItems[i].id.videoId) {
        this.isCheckedAsFavorite = true;
      }
    }
  }
}
