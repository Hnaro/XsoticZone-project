import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSessionCompComponent } from './create-session-comp.component';

describe('CreateSessionCompComponent', () => {
  let component: CreateSessionCompComponent;
  let fixture: ComponentFixture<CreateSessionCompComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSessionCompComponent]
    });
    fixture = TestBed.createComponent(CreateSessionCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
