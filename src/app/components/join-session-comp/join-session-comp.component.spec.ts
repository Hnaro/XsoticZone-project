import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinSessionCompComponent } from './join-session-comp.component';

describe('JoinSessionCompComponent', () => {
  let component: JoinSessionCompComponent;
  let fixture: ComponentFixture<JoinSessionCompComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinSessionCompComponent]
    });
    fixture = TestBed.createComponent(JoinSessionCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
