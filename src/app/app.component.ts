import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import firebase from 'firebase';
import { AuthService } from '../services/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // make HelloIonicPage the root (or first) page
  tabsPage: any = TabsPage;
  signinPage: any = SigninPage;
  signupPage = SignupPage;
  isAuthenticated = false;
  @ViewChild('nav') nav: NavController;

  constructor(
    public platform: Platform,
    private menuCtrl: MenuController,
    private authCtrl: AuthService
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyBme1h97pwfn286doTbi1UBKGQwGHqmmmA",
      authDomain: "angular2-course-37876.firebaseapp.com"
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.tabsPage = TabsPage;
      } else {
        this.isAuthenticated = false;
        this.tabsPage = SigninPage;
      }
    });

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }  

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authCtrl.logout();
    this.menuCtrl.close();
    this.nav.setRoot(SigninPage);
  }
}
