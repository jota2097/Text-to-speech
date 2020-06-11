import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Speech from 'speak-tts'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  form: FormGroup;
  speech: any;
  voices: any[] = [];
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildFormGroup();
    this.initSpeech();
  }

  buildFormGroup(): void {
    this.form = this._formBuilder.group({
      message: ['', Validators.required],
      voices: ['']
    });
  }

  speechText(): void {
    this.speech.speak({
      text: this.form.controls['message'].value,
    }).then(() => {
      console.log("Success !")
    }).catch(e => {
      console.error("An error occurred :", e)
    })
  }

  initSpeech(): void {
    this.speech = new Speech() // will throw an exception if not browser supported
    if (this.speech.hasBrowserSupport()) { // returns a boolean

      this.speech.init({
        'volume': 1,
        'lang': 'en-GB',
        'rate': 1,
        'pitch': 1,
        'voice': 'Google UK English Male',
        'splitSentences': true,
        'listeners': {
          'onvoiceschanged': (voices) => {
            console.log("Event voiceschanged", voices)
          },
          onstart: () => {
            console.log("Start utterance")
          },
          onend: () => {
            console.log("End utterance")
          },
          onresume: () => {
            console.log("Resume utterance")
          },
          onboundary: (event) => {
            console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.')
          }
        }
      }).then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data)
        this.voices = data.voices;
        this.form.controls['voices'].setValue(0);
      }).catch(e => {
        console.error("An error occured while initializing : ", e)
      })
    } else {
      console.log("speech has not supported for this browser")
    }
  }

  onChangeVoice(value: any): void {
    this.speech.setLanguage(this.voices[value].lang);
    this.speech.setVoice(this.voices[value].name);
  }

  pause(): void {
    this.speech.pause();
  }

  resume(): void {
    this.speech.resume();
  }
}
