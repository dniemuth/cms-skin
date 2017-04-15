/// <reference path="../../../node_modules/@types/gapi/index.d.ts" />
import { Component, NgZone, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { User } from './google.model';
import { DataService } from '../../app/google.data.service'
declare var gapi: any;

@IonicPage()
@Component({
  selector: 'page-google',
  templateUrl: 'google.html',
})
export class GooglePage implements OnInit {
  user: User;

  constructor(public navCtrl: NavController, private _zone: NgZone, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.loadClient();
    //this.user = this.makeApiCall();
    this.user = {username: 'Mr. Pool', email: 'deadpool@killthethings.com'}
    //this.user = this.dataService.getUser();
    
  }

  getUser() {

  }

  ionViewDidLoad() {

    //this.user = this.dataService.getUser();

    //this.loadClient();
  
  }

  loadClient() {
    console.log('inside loadClient')
    gapi.load('client:auth2', this.initClient); 
  }

  initClient() {
    gapi.client.init({
      clientId: '111138137302-diqvrkl3cnd5pa0hkl3puhpm8gb1sdep.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive'
    }).then(() => {
      //gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()));
      //this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
      var test: any = gapi.client;
      console.log(test);
    });
  }

  updateSigninStatus(isSignedIn) {
    if(isSignedIn) {
      this.makeApiCall();
    }
  }

  signInClick() {
    this.dataService.signInClick();
    //gapi.auth2.getAuthInstance().signIn();
    //console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  signOutClick() {
    this.dataService.signOutClick();
    // gapi.auth2.getAuthInstance().signOut();
    // console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  makeApiCall() {
    var user2;
    var request = gapi.client.request({
      'method': 'GET',
      'path': '/drive/v3/about',
      'params': {'fields': 'user'}
    });

    var request2 = gapi.client.request({
      'method': 'GET',
      'path': '/drive/v3/files',
      'params': {
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
      }
    });
    request.execute((response) => {
      console.log(response);
      console.log('Hello, ' + response.user.displayName);
      user2 = {username: response.user.displayName, email: response.user.emailAddress}
      this.user = user2;

    }, (reason) => {
      console.log('Error: ' + reason.result.error.message);
    });

    request2.execute((response) => {
      console.log(response);
      console.log('Files: ');
      var files = response.files;
      files.forEach(file => {
        console.log(file.name + ': ' + file.id);
      });
    }, (reason) => {
      console.log('Error: ' + reason.result.error.message);
    });
    console.log('current user is: ' + this.user);
  }

  makeApiCall2() {
    this.dataService.apiGetUser();
    this.dataService.apiGetFiles();
  }
}
