import { Component, Inject, HostListener} from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public getScreenWidth: any;
  public getScreenHeight: any;
  title = 'Login';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();



  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService, private broadcastService: MsalBroadcastService){

  }

  ngOnInit(){

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.isIframe = window !== window.parent && !window.opener;


    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
  }

  @HostListener('window:resize', ['$event']) onWindowResize(){
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  login() {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        .subscribe({
          next: (result) => {
            console.log(result);
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (result) => {
            console.log(result);
            this.setLoginDisplay();
          },
          error: (error) => console.log(error)
        });
    }
  }



  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
