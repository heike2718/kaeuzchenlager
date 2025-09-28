import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, HomeComponent, RouterModule.forRoot([{ path: '', component: HomeComponent }])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
