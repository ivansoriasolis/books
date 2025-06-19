import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookUploaderComponent } from './book-uploader.component';

describe('BookUploaderComponent', () => {
  let component: BookUploaderComponent;
  let fixture: ComponentFixture<BookUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
