import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemsTable } from './invoice-items-table';

describe('InvoiceItemsTable', () => {
  let component: InvoiceItemsTable;
  let fixture: ComponentFixture<InvoiceItemsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceItemsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceItemsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
