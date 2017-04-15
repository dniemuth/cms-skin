import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Location } from '@angular/common';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  url: any = location.hostname;
  
  constructor(public navCtrl: NavController) {
    
  }

}
