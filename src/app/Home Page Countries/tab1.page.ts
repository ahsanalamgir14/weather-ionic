import { Component, OnInit } from '@angular/core';
import { HomeService } from './service/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  post: any;

  constructor(public homeService: HomeService, private router: Router) {}

  ngOnInit() {
    this.searchPost();
  }

  async searchPost() {
    const loading = await this.homeService.presentLoading();
    this.homeService.search().subscribe(
      (payload: any) => {
        console.log(payload);
        this.post = payload;
        this.homeService.dismissLoading(loading);
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  goToCountryDetail(countryName: string) {
    this.router.navigate(['/country-detail', countryName]);
  }
}