import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TictactoeboxComponent } from './tictactoebox.component';

describe('TictactoeboxComponent', () => {
  let component: TictactoeboxComponent;
  let fixture: ComponentFixture<TictactoeboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TictactoeboxComponent]
    });
    fixture = TestBed.createComponent(TictactoeboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
