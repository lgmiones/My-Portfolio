import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { WorkComponent } from './pages/work/work.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CourtArtComponent } from './shared/court-art/court-art.component';
import { MOTION_DIRECTIVES } from './motion/motion.directives';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WorkComponent,
    AboutComponent,
    ContactComponent,
    NavbarComponent,
    FooterComponent,
    CourtArtComponent,
    ...MOTION_DIRECTIVES,
  ],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {
  /** Keeps the browser tab title in sync with the route. */
  constructor(router: Router, route: ActivatedRoute, title: Title) {
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let r = route;
      while (r.firstChild) r = r.firstChild;
      const page = r.snapshot.data['title'] as string | undefined;
      title.setTitle(page ? `Louell Grey Miones — ${page}` : 'Louell Grey Miones');
    });
  }
}
