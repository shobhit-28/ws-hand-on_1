import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSearchedUserComponent } from './single-searched-user.component';

describe('SingleSearchedUserComponent', () => {
  let component: SingleSearchedUserComponent;
  let fixture: ComponentFixture<SingleSearchedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleSearchedUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleSearchedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
