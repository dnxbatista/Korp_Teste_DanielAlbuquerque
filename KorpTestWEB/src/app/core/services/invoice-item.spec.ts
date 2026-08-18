import { TestBed } from '@angular/core/testing';

import { InvoiceItem } from './invoice-item.service';

describe('InvoiceItem', () => {
  let service: InvoiceItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
