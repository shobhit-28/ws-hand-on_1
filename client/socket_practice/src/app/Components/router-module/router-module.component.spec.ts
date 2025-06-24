import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModuleComponent } from './router-module.component';

describe('RouterModuleComponent', () => {
  let component: RouterModuleComponent;
  let fixture: ComponentFixture<RouterModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
