import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatOutletComponent } from './chat-outlet.component';

describe('ChatOutletComponent', () => {
  let component: ChatOutletComponent;
  let fixture: ComponentFixture<ChatOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatOutletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
