import { TestBed } from '@angular/core/testing';

import { TictactoeGamecontrolService } from './tictactoe-gamecontrol.service';

describe('TictactoeGamecontrolService', () => {
  let service: TictactoeGamecontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TictactoeGamecontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
