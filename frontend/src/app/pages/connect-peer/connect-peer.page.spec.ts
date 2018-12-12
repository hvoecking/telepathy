import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectPeerPage } from './connect-peer.page';

describe('ConnectPeerPage', () => {
  let component: ConnectPeerPage;
  let fixture: ComponentFixture<ConnectPeerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectPeerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectPeerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
