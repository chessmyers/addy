import { Component } from '@angular/core';

import { ClassesPage } from "../classes/classes";
import { FilesPage } from "../files/files";
import { FeedPage } from "../feed/feed";
import { CalendarPage } from "../calendar/calendar";
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FeedPage;
  tab2Root = ClassesPage;
  tab3Root = HomePage;
  tab4Root = CalendarPage;
  tab5Root = FilesPage;


  constructor() {

  }
}
