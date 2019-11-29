import { Directive, Input, ElementRef, AfterViewInit, OnChanges, DoCheck, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[readMore]'
})

export class ReadMoreDirective implements  AfterViewInit, OnChanges {
  @Input('readMore-length')  private maxLength:     number;
  @Input('readMore-element') private elementChange: HTMLElement;
  @Input('readMore-text') private text: string;

  private currentText: string;
  private hideToggle:  boolean = true;
  private oldText:        string;
 // private text:        string;
  private isCollapsed: boolean = true;

  constructor(private el: ElementRef) {}

  /**
   * @inheritDoc
   */
  public ngAfterViewInit() {
    this.text = this.elementChange.innerHTML;
    //console.log(this.elementChange ,'change')
    //this.toggleView();
    // setTimeout(() => {
    //   this.toggleView();
    // }, 100);
    if (!this.hideToggle) {
      this.el.nativeElement.classList.remove('hidden');
    } else {
      this.el.nativeElement.classList.add('hidden');
    }
    this.el.nativeElement.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.toggleView();
    });
  }

  /**
   * @inheritDoc
   */
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.text) {
      //console.log('in this.text:',changes);
      //this.hideToggle = false;
      //this.el.nativeElement.classList.add('hidden');

      setTimeout(() => {
        this.toggleView();
      }, 100);
      // this.el.nativeElement.addEventListener('click', (event: MouseEvent) => {
      //   event.preventDefault();
      //   this.toggleView();
      // });
      this.oldText = (changes.text.previousValue)? changes.text.previousValue : changes.text.currentValue;
      //console.log('this.oldText:',this.oldText);
      //console.log('this.text:',this.text);
      //this.toggleView();
    }
  }

  public ngDoCheck(){
    // //console.log('in here 2',this.text);
    // //console.log('this.oldText:',this.oldText);
    // //console.log('condtion:',(this.oldText !== this.text));
    // if(this.oldText !== this.text){
    //   //console.log('one time');
    //     //take custom action
    //   this.toggleView();
    //   this.oldText = this.text;
    // }
  }

  /**
   * Toogle view - full text or not
   */
  private toggleView(): void {
    if(this.text){
      this.determineView();
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        this.el.nativeElement.querySelector('.more').style.display = "none";
        this.el.nativeElement.querySelector('.less').style.display = "inherit";
      } else {
        this.el.nativeElement.querySelector('.more').style.display = "inherit";
        this.el.nativeElement.querySelector('.less').style.display = "none";
      }
      if(this.hideToggle){
        this.el.nativeElement.querySelector('.more').style.display = "none";
        this.el.nativeElement.querySelector('.less').style.display = "none";
      }
    }
  }

  /**
   * Determine view
   */
  private determineView(): void {
    const _elementChange = document.getElementById(this.elementChange.id);
    //console.log(_elementChange)
    if(this.text){
      //console.log('in determineView');
      if (this.text.length <= this.maxLength) {
        this.currentText = this.text;
        _elementChange.innerHTML = this.currentText;
        this.isCollapsed = false;
        this.hideToggle = true;
        return;
      }
      //console.log('in determineView 2',this.isCollapsed);
      this.hideToggle = false;
      if (this.isCollapsed === true) {
        this.currentText = this.text.substring(0, this.maxLength) + '';
        //console.log('this.currentText:',this.currentText);
        //console.log('_elementChange:');
        //console.log(_elementChange);
        _elementChange.innerHTML = this.currentText;
      } else if (this.isCollapsed === false)  {
        this.currentText = this.text;
        _elementChange.innerHTML = this.currentText;
      }
    }

  }
}
