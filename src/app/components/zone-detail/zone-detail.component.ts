import {
  Component,
  OnInit,
  AfterViewInit,
  state,
  Input,
  OnChanges,
  AfterContentChecked,
  AfterViewChecked,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GlobalState } from '../../global.state';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';


declare var $:any;

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss'],
})
export class ZoneDetailComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() uid: any;
  @Input() zoneData: any;
  @ViewChild('textContent') _elementChange: ElementRef;

  maxLength = 437;
  currentText:any;
  private isCollapsed: boolean = true;

  constructor(
    fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public globalState: GlobalState,
  ) {}

  ngOnInit(): void {
    console.log('in zone-detail');
  }

  ngAfterViewInit(): void {}

  // ngAfterContentChecked() {
  //   //Called after every check of the component's or directive's content.
  //   //Add 'implements AfterContentChecked' to the class.

  // }

  // ngAfterViewChecked() {
  //   //Called after every check of the component's view. Applies to components only.
  //   //Add 'implements AfterViewChecked' to the class.

  // }

  ngOnChanges(changes: any): void {
    //console.log('in on change');
    //console.log(changes);
    if(changes.zoneData){
      this.currentText = changes.zoneData.currentValue;

      // console.log('"#" + this._elementChange.nativeElement.id:',"#" + this._elementChange.nativeElement.id);
      // console.log(this._elementChange.nativeElement);
      // $(this._elementChange.nativeElement).shorten({showChars: 100});

      if(this.currentText)
      this.toggleView();
    }
  }

  determineView(){
    if (this.zoneData.length <= this.maxLength) {
      this.currentText = this.zoneData;
      this._elementChange.nativeElement.innerHTML = this.currentText;
      this.isCollapsed = false;
      return;
    }

    if (this.isCollapsed === true) {
      let parsed = jQuery.parseHTML(this.zoneData);
      // console.log('CURRENT TEXT => ',this.currentText);
      // console.log('CURRENT TEXT => ',parsed);
      this.currentText = parsed["0"].innerHTML;
      
      if(this.currentText){
        let isBreakFine = true;
        let inTag = false;
        let lastIndex = 0;
        let startIndex = 0;
        // console.log('PARSED FIRST TEXT => ',this.currentText[this.maxLength]);
        if(this.currentText[this.maxLength] == ' '){
          isBreakFine = true
        }else{
          isBreakFine = false;
          lastIndex = this.maxLength;
          // console.log('PARSED FIRST TEXT => ',lastIndex);
          // console.log('PARSED FIRST TEXT => ',this.currentText.length);
          while (lastIndex <= this.currentText.length) {
            if(this.currentText[lastIndex] == '>' || this.currentText[lastIndex] == ' '){
              inTag = (this.currentText[lastIndex] == '>')? true : false;
              break;
            }
            lastIndex++;
          }
          startIndex = this.maxLength;
          while (startIndex >= 0) {
            if(this.currentText[startIndex] == '<' || this.currentText[startIndex] == ' '){
              inTag = (this.currentText[startIndex] == '<')? true : false;
              break;
            }
            startIndex--;
          }
        }
        if(isBreakFine){
          this.currentText = this.currentText.substring(0, this.maxLength);
          this.currentText = String(this.currentText).replace(/((\.)|(<br>))+$/,'');
          this.currentText += '<a href="javascript:;" class="btn btn-link a_show_more"><strong class="less">...Less</strong><strong class="more">More...</strong></a>';
        }
        else{
          this.currentText = this.currentText.substring(0, startIndex);
          this.currentText = String(this.currentText).replace(/((\.)|(<br>))+$/,'');
          this.currentText += '<a href="javascript:;" class="btn btn-link a_show_more"><strong class="less">...Less</strong><strong class="more">More...</strong></a>';
        }
        //console.log('this.currentText:',this.currentText);
        this._elementChange.nativeElement.innerHTML = this.currentText;
      }
    } else if (this.isCollapsed === false)  {
      let parsed = jQuery.parseHTML(this.zoneData);
      this.currentText = parsed["0"].innerHTML;
      for(let i = 1; i<parsed.length; i++) {
        if(parsed[i].nodeName == "P") {
          this.currentText += parsed[i].innerHTML;
        }
      }
      this.currentText = this.currentText  + '<br/><a href="javascript:;" class="btn btn-link a_show_more"><strong class="less">...Less</strong><strong class="more">More...</strong></a>';
      this._elementChange.nativeElement.innerHTML = this.currentText;
    }
  }

  toggleView(): void {
    if(this.zoneData){
      //console.log('this.zoneData:',this.zoneData);
      this.determineView();
      setTimeout(() => {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
          if(this._elementChange.nativeElement.querySelector('.more'))
          this._elementChange.nativeElement.querySelector('.more').style.display = "none";
          if(this._elementChange.nativeElement.querySelector('.less'))
          this._elementChange.nativeElement.querySelector('.less').style.display = "inherit";
        } else {
          if(this._elementChange.nativeElement.querySelector('.more'))
          this._elementChange.nativeElement.querySelector('.more').style.display = "inherit";
          if(this._elementChange.nativeElement.querySelector('.less'))
          this._elementChange.nativeElement.querySelector('.less').style.display = "none";
        }
        //console.log(this._elementChange.nativeElement.querySelector('.a_show_more'));

        if(this._elementChange.nativeElement.querySelector('.a_show_more'))
        this._elementChange.nativeElement.querySelector('.a_show_more').addEventListener('click', (event: MouseEvent) => {
              event.preventDefault();
              this.toggleView();
          });
      }, 20);
    }
  }

}
