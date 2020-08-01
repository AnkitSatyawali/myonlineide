import { Component, OnInit,AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

import { EditorService } from './services/editor.service';
const THEME = 'ace/theme/monokai'; 
const LANG = 'ace/mode/json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild('codeEditor') codeEditorElmRef: ElementRef;
    private codeEditor: ace.Ace.Editor;
  title = 'onlineide';
  showInputBox = false;
  showOutput = false;
  status;
  output;
  time;
  themes = ['white','dark','magic','incredible'];
  languages:Array<{name,id}>;
  langugaesAndCode = [
    ['C++','#include<iostream>\nusing namespace std;\nint main()\n{\ncout<<"Hello!";\nreturn 0;\n}'],
    ['C','#include<stdio.h>\nint main()\n{\nprintf("Hello");return 0;\n}'],
    ['Java','public class Main\n{\npublic static void main(String[] args)\n{\nSystem.out.println("Hello!");\n}\n}'],
    ['Javascript','console.log("Hello!")'],
    ['Python (2','print("Hello!")'],
    ['Python (3','print "Hello!"']
  ]
  selectedlanguage;
  id;
  constructor (private editorService : EditorService) {}
  ngAfterViewInit() {
  	const element = this.codeEditorElmRef.nativeElement;
        const editorOptions: Partial<ace.Ace.EditorOptions> = {
            highlightActiveLine: true,
            minLines: 20,
            maxLines: 20,
        };

        this.codeEditor = ace.edit(element, editorOptions);
        this.codeEditor.setTheme(THEME);
        this.codeEditor.session.setMode(LANG);
        this.codeEditor.setShowFoldWidgets(true);
        this.codeEditor.setShowPrintMargin(false);
        if(this.editorService.getCookies('language'))
         {
           this.selectedlanguage = this.editorService.getCookies('language');
           this.id = this.editorService.getCookies('id');
           let code = this.editorService.getCookies(this.selectedlanguage);
           if(code)
           this.codeEditor.setValue(code);
           else
           this.codeEditor.setValue("Write your creativity here");
         }
         else
         {
           this.editorService.setCookies('language','C++');
           this.editorService.setCookies('id',54);
           if(!this.editorService.getCookies('C++'))
            {
              let i;
              for(i=0;i<this.langugaesAndCode.length;i++)
              {
                this.editorService.setCookies(this.langugaesAndCode[i][0],this.langugaesAndCode[i][1]);
              }
            }
           this.selectedlanguage = this.editorService.getCookies('language');
           this.id = this.editorService.getCookies('id');
           let code = this.editorService.getCookies(this.selectedlanguage);
           this.codeEditor.setValue(code);
         }

  }
  ngOnInit(){
      this.editorService.getLanguages().subscribe((data:Array<{name,id}>) => {
        this.languages = data;
        console.log(this.languages)
      })
      this.editorService.result.subscribe(data => {
        this.showOutput = true;
        console.log(data);
        
      },err => {
        console.log(err);
      })
  }

  themeChange(theme) 
    {
      console.log(theme);
    }
    sletop(lg) {
      console.log(lg);
    }

   getId(language) {
     let i;
     for(i=0;i<this.languages.length;i++)
     {
       if(this.languages[i].name === language)
       {
         this.id = this.languages[i].id;break;
       }
     }
   }
  languageChange(language) 
   {
     this.selectedlanguage = language;
     this.getId(language);
     console.log(this.id)
     if(this.selectedlanguage.slice(0,3)==='C++')
     {
       let code = this.editorService.getCookies('C++');
       this.codeEditor.setValue(code);
       this.editorService.setCookies('language','C++')
       this.editorService.setCookies('id',this.id);
     }  
     else if(this.selectedlanguage.slice(0,1)==='C')
     {
       let code = this.editorService.getCookies('C');
       this.codeEditor.setValue(code);
       this.editorService.setCookies('language','C')
       this.editorService.setCookies('id',this.id);
     }  
     else if(this.selectedlanguage.slice(0,9)==='Javascript')
     {
       let code = this.editorService.getCookies('Javascript');
       this.codeEditor.setValue(code);
       this.editorService.setCookies('language','Javascript')
       this.editorService.setCookies('id',this.id);
     }
     else if(this.selectedlanguage.slice(0,4)==='Java')
     {
       let code = this.editorService.getCookies('Java');
       this.codeEditor.setValue(code);
       this.editorService.setCookies('language','Java')
       this.editorService.setCookies('id',this.id);
     }
     else if(this.selectedlanguage.slice(0,9)==='Python (2')
     {
       let code = this.editorService.getCookies('Python (2');
       this.codeEditor.setValue(code);
       this.editorService.setCookies('language','Python (2')
       this.editorService.setCookies('id',this.id);
     }
     else if(this.selectedlanguage.slice(0,9)==='Python (3')
     {
       let code = this.editorService.getCookies('Python (3');
       this.codeEditor.setValue(code);
       this.editorService.setCookies('language','Python (3')
       this.editorService.setCookies('id',this.id);
     }
     else
     {
       this.codeEditor.setValue("#Write your creativity here");
       this.editorService.setCookies('language',this.selectedlanguage);
       this.editorService.setCookies('id',this.id);
     }
  }    
  submitCode(){
    var code = this.codeEditor.getValue();
    this.editorService.SubmitCode(this.id,code,'').subscribe(token => {
      console.log(token);
      this.editorService.getSubmission(token.token);
    },err => {
      console.log(err);
    });
  }
  showInput()
  {
    this.showInputBox = !this.showInputBox;
  }
}
