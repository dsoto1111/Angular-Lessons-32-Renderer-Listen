import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('draggable') element!: ElementRef;

  constructor(private renderer2: Renderer2) {}

  private unListenMouseDown!: () => void;
  private unListenMouseMove!: () => void;
  private unListenMouseUp!: () => void;

  ngAfterViewInit(): void {
    this.unListenMouseDown = this.renderer2.listen(
      this.element.nativeElement,
      'mousedown',
      (event: MouseEvent) => {
        this.unListenMouseMove = this.renderer2.listen(
          'document',
          'mousemove',
          (event: MouseEvent) => {
            this.renderer2.setStyle(
              this.element.nativeElement,
              'top',
              event.pageY + 'px'
            );
            this.renderer2.setStyle(
              this.element.nativeElement,
              'left',
              event.pageX + 'px'
            );
          }
        );

        this.unListenMouseUp = this.renderer2.listen(
          'document',
          'mouseup',
          () => {
            this.unListenMouseMove();
            this.unListenMouseUp();
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.unListenMouseDown();
  }
}
