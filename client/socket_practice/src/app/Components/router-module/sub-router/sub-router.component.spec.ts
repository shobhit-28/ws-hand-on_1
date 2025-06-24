import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRouterComponent } from './sub-router.component';

describe('SubRouterComponent', () => {
  let component: SubRouterComponent;
  let fixture: ComponentFixture<SubRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubRouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
