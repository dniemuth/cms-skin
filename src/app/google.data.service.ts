/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
import { Injectable } from '@angular/core';
import { createUser } from './test-data';
import { User } from '../pages/google/google.model';
declare var gapi: any;

@Injectable()
export class DataService {
    private CLIENT_ID = '111138137302-diqvrkl3cnd5pa0hkl3puhpm8gb1sdep.apps.googleusercontent.com';
    private SCOPE = 'https://www.googleapis.com/auth/drive';

    constructor() { }

    getUser() {
        if(gapi.auth2.getAuthInstance().isSignedIn.get()) {
            console.log('is logged in');
        }
        else {
            console.log('is not logged in');
            
        }
    }

    loadClient() {
        gapi.load('client:auth2', this.initClient);
    }

    initClient() {
        gapi.client.init({
            clientId: '111138137302-diqvrkl3cnd5pa0hkl3puhpm8gb1sdep.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive'
        }).then(function() {
            //gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()));
            //this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    updateSigninStatus(isSignedIn) {
        if(isSignedIn) {
            this.apiGetUser();
        }
    }

    signInClick() {
        gapi.auth2.getAuthInstance().signIn();
    }
    
    signOutClick() {
        gapi.auth2.getAuthInstance().signOut();
        console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
    }

    apiGetUser() {
        var user;
        var request = gapi.client.request({
            'method': 'GET',
            'path': '/drive/v3/about',
            'params': {'fields': 'user'}
        });
        request.execute((response) => {
            var uname: string = response.user.displayName;
            var emadd: string = response.user.emailAddress;
            user = {username: uname, email: emadd}
            console.log(user);
            document.getElementById('name').innerHTML = 'Welcome, ' + user.username;
        }, (reason) => {
            console.log('Error: ' + reason.result.error.message);
        });
    }

    apiGetFiles() {
        var fileStuff = 'Files: ';
        var request2 = gapi.client.request({
            'method': 'GET',
            'path': '/drive/v3/files',
            'params': {
                'pageSize': 10,
                'fields': "nextPageToken, files(id, name)"
            }
        });
        request2.execute((response) => {
            console.log(response);
            console.log('Files: ');
            var files = response.files;
            var fileList = [];
            files.forEach(file => {
                console.log(file.name + ': ' + file.id);
                var fid = file.id;
                var fname = file.name;
                fileList.push({fid, fname})
                fileStuff = fileStuff + '<li>' + file.name + '</li>';
            });
            document.getElementById('files').innerHTML = fileStuff;
        }, (reason) => {
            console.log('Error: ' + reason.result.error.message);
        });
    }
}