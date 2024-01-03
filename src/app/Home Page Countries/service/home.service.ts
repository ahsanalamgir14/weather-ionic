import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'

})

export class HomeService {

    constructor(public http: HttpClient, private loadingController: LoadingController) { }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: false  ,
        });
        
        await loading.present();
        return loading;
    }
    
    dismissLoading(loading: HTMLIonLoadingElement) {
    if (loading) {
        loading.dismiss();
    }
    }

    search() {
        return this.http.get('https://restcountries.com/v3.1/all')
    }

    getCountryByName(countryName: string) {
        return this.http.get(`https://restcountries.com/v3.1/name/${countryName}`);
    }
    
    getWeatherData(lat: string, long: string) {
        const apiKey = '8CZ7YPQQ9358EM2QPJFXBE9B7';
        const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=${apiKey}`;
      
        return this.http.get(apiUrl)
    }

    getCurrencyRate(currencyCode: string) {
        const apiKey = 'e689835146794abd911c369b';
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/EUR/${currencyCode}`;
      
        return this.http.get(apiUrl)
    }
}