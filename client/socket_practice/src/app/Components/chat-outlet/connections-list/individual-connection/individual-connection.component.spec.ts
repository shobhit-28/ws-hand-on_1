import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualConnectionComponent } from './individual-connection.component';

describe('IndividualConnectionComponent', () => {
  let component: IndividualConnectionComponent;
  let fixture: ComponentFixture<IndividualConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualConnectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
