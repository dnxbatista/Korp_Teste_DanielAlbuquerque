import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsFormComponent } from './products-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFormComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});