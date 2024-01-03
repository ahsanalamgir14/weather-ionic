// country-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../service/home.service';
import { AlertController, LoadingController } from '@ionic/angular';

interface Language {
  code: string;
  name: string;
}

@Component({
  selector: 'app-country-detail',
  templateUrl: 'country-detail.component.html',
  styleUrls: ['country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  countryName: string;
  weatherDetails: string = '';
  countryData: any;
  currencyAmount: number;
  exchangeRateToEUR: number = 0;
  showConvertedAmount: boolean = false;
  amountInEuro: number;

  constructor(private route: ActivatedRoute, public homeService: HomeService,
    private alertController: AlertController,
    private loadingController: LoadingController) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('countryName')!;
      this.loadCountryDetail();
    });
  }

  async loadCountryDetail() {

    const loading = await this.homeService.presentLoading();
    await this.homeService.getCountryByName(this.countryName).subscribe(
      (data: any) => {
        this.countryData = data[0];
        console.log('countryData :', this.countryData);
        this.getWeatherDetails();
        this.homeService.dismissLoading(loading);
      },
      (error: any) => {
        console.error('Error fetching country detail:', error);
      }
    );
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['Ok'],
    });

    await alert.present();
  }


  getCurrencies(): any[] {
    if (!this.countryData || !this.countryData.currencies) {
      return [];
    }

    return Object.keys(this.countryData.currencies);
  }

  getLanguages(): Language[] {
    if (!this.countryData || !this.countryData.languages) {
      return [];
    }
  
    return Object.entries(this.countryData.languages).map(([code, name]) => ({ code, name: name as string }));
  }

  async getWeatherDetails() {
    const lat = this.countryData?.latlng[0]
    const long = this.countryData?.latlng[1]
    await this.homeService.getWeatherData(lat, long).subscribe(
      (data: any) => {
        this.weatherDetails = data.description
      },
      (error: any) => {
        console.error('Error fetching country detail:', error);
      }
    );
  }

  currencyChanged() {
    this.showConvertedAmount = false;
  }

  async convertToEUR() {
    if (this.currencyAmount) {
      const currencyCode = this.getCurrencies()[0];
      await this.homeService.getCurrencyRate(currencyCode).subscribe(
        (data: any) => {
          this.exchangeRateToEUR = data.conversion_rate;
          this.showConvertedAmount = true;
          this.amountInEuro = parseFloat((this.currencyAmount * this.exchangeRateToEUR).toFixed(2));
        },
        (error: any) => {
          console.error('Error fetching country detail:', error);
        }
      );
    }
  }
}
