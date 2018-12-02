import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ClassesPage } from "../pages/classes/classes";
import { FeedPage } from "../pages/feed/feed";
import { FilesPage } from "../pages/files/files";
import { CalendarPage } from "../pages/calendar/calendar";
import { ClassviewPage } from "../pages/subpages/classview/classview";
import { PostviewPage } from "../pages/subpages/postview/postview";
import { AddfilePage } from "../pages/subpages/addfile/addfile";
import { AddclassPage } from "../pages/subpages/addclass/addclass";
import { AddpostPage } from "../pages/subpages/addpost/addpost";
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ClassesPage,
    FeedPage,
    FilesPage,
    CalendarPage,
    ClassviewPage,
    PostviewPage,
    AddfilePage,
    AddclassPage,
    AddpostPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ClassesPage,
    FeedPage,
    FilesPage,
    CalendarPage,
    ClassviewPage,
    PostviewPage,
    AddfilePage,
    AddclassPage,
    AddpostPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
