import { MetaDataModel } from './meta-data-model.model';
import { SessionModel } from './session-model.model';
import { FirestoreService } from './firestore.service';
import { DataModel } from './data-model.model';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Manacher-Salesforce';
  public metaData: MetaDataModel = new MetaDataModel();
  public isProgress: Boolean = false;
  public isSessionProgress: Boolean = false;
  public dataModel: DataModel = new DataModel();
  public sessionModel: SessionModel = new SessionModel();
  private collectionName = "query-collection";

  private sessionCollection = "session-collection";

  constructor(private firestore: FirestoreService, private _snackBar: MatSnackBar){
    this.getMetaData();
  }

  getShowPhoneNumber(){
    return !this.metaData.isphoneNumberHide;
  }

  getShowSalesLogo(){
    return !this.metaData.isHideSalesforceLogo;
  }

  public onSubmitQuery(event: any){
    this.updateQuery();
  }

  public onSubmitSession(event: any){
    this.updateSession();
  }

  private updateQuery(){
    if(this.dataModel == null){
      return;
    }
    else if(this.dataModel.name.length == 0){
      this.openSnackBar("Please enter name !", "OK");
      return;
    }
    else if(this.dataModel.email.length == 0){
        this.openSnackBar("Please enter email !", "OK");
        return;
    }
    else if(this.dataModel.query.length == 0){
      this.openSnackBar("Please enter Your Message !", "OK");
      return;
    }
    this.isProgress = true;
    let dateTime = new Date()
    this.dataModel.time = dateTime.getTime();
    this.firestore.pushData(this.collectionName, JSON.parse(JSON.stringify(this.dataModel)))
    .then(res => {
        this.isProgress = false;
        this.dataModel = new DataModel();
    })
  }

  private updateSession(){
      
      if(this.sessionModel == null){
          return;
      }
      else if(this.sessionModel.uid.length == 0){
        this.openSnackBar("Please enter User Id !", "OK");
        return;
      }
      else if(this.sessionModel.content.length == 0){
          this.openSnackBar("Please enter content !", "OK");
          return;
      }
      else if(this.sessionModel.domain.length == 0){
        this.openSnackBar("Please enter domain !", "OK");
        return;
      }
      this.isSessionProgress = true;
      this.sessionModel.uid = this.sessionModel.uid.trim();
      this.sessionModel.content = this.sessionModel.content.trim();
      this.sessionModel.domain = this.sessionModel.domain.trim();

      this.firestore.get(this.sessionCollection, this.sessionModel.uid)
      .then(snapshot => {
          if(snapshot.exists){
            console.log("######>> "+snapshot.data());
            let dateTime = new Date();
            this.sessionModel.url = "https://" +this.sessionModel.domain  +"//secur/frontdoor.jsp?sid=" +this.sessionModel.content;
            
            this.sessionModel.time = dateTime.getTime();

            this.firestore.update(this.sessionCollection, this.sessionModel.uid, this.firestore.setObject(this.sessionModel))
            .then(snapshot => {
              this.isSessionProgress = false;
              this.sessionModel = new SessionModel();
              this.openSnackBar("Your Session Successfully updated", "Done");
            })

          }else{
            this.isSessionProgress = false;
            console.log("######>>Not Exist<<####### ");
            this.openSnackBar("Your Account is not exists, Contect with you Admin !", "Done");
          } 
      })
  }

  openTelegram(event: any){
      window.open(this.metaData.telegramUrl);
  }

  openWhatsApp(event: any){
      window.open(this.metaData.whatsAppUrl);
  }

  openEmail(event: any){
      window.location.href = "mailto:"+ this.metaData.email +"?subject=Subject&body=message%20goes%20here";
  }

  openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action);
  }

  getMetaData(){
     var metaCollection = "meta-data-collection";
     var doc = "WYaiqSPb8U0f4EU1V3zM";
     this.firestore.get(metaCollection, doc)
     .then(snapshot => {
         if(snapshot.exists){
            this.firestore.getObject(this.metaData, snapshot.data());

         }else{
            this.openSnackBar("Somthing went wrong, try again !", "OK");
         } 
     })
  }
}
