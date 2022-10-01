import { Observable } from 'rxjs';
import { Action, AngularFirestore, DocumentChangeAction, DocumentData, DocumentSnapshot, Query, QuerySnapshot} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore) {}

      public save(collection:string, document:string, data:any): Promise<void>{  

        return this.firestore.collection(collection).doc(document).set(data);      
      }

      public pushData(collection: string, data: any): Promise<void>{
        return this.firestore.collection(collection).doc().set(data);

      }

      public setData(collection: string, document: string, data: any){
        return this.firestore.collection(collection).doc(document).set(data);
      }

      public getList(collection: string, limit: number){
        return this.firestore.collection(collection).get();
      }

      public getWhichEquals(collection:string, field:string, value:string){
        return this.firestore.collection(collection, ref => ref.where(field, "==" , value)).get();
      } 
      public getEquals(collection:string, key:string, value:string){
        return this.firestore.collection(collection, ref => ref.where(key, "==" , value)).get().toPromise();    
      }
      public getEqualsDouble(collection:string, key1:string, value1:string, key2:string, value2:string){
        return this.firestore.collection(collection, ref => ref.where(key1, "==" , value1).where(key2, "==", value2)).get().toPromise();    
      }
      public get(collection:string, document: string | undefined){

        return this.firestore.collection(collection).doc(document).get().toPromise();
      
      }
      
      public getObs(collection:string, document:string){

        return this.firestore.collection(collection).doc(document).get();
      
      }
      public getValueChanges(collection:string, document:string){

        return this.firestore.collection(collection).doc(document).valueChanges();
      
      }
      public getRealtimeCollection(collection:string){

        return this.firestore.collection(collection).valueChanges();
      
      }
      public getQueuesCollection(collection:string){

        return this.firestore.collection(collection).stateChanges();
      
      }
      public getIceChangesCollection(collection:string){

        return this.firestore.collection(collection).stateChanges();
      
      }
      // stateChanges
      public getRealTimeCollectionWithQuery(collection:string, key1:string, value1:string, key2:string, value2:string, key3:string, value3:string, orderBy:string):Observable<unknown[]> {
        return this.firestore.collection(collection, ref =>
          ref.where(key1, "==", value1)
            .where(key2, "==", value2)
            .where(key3, "==", value3)
          .orderBy(orderBy))
          .valueChanges();
      }
      public getBookingChanges(collection:string, key1:string, value1:string, key2:string, value2:string, key3:string, value3:string, orderBy:string):Observable<DocumentChangeAction<unknown>[]> {
        return this.firestore.collection(collection, ref =>
          ref.where(key1, "==", value1)
            .where(key2, "==", value2)
            .where(key3, "==", value3)
            .orderBy(orderBy))
          .stateChanges();
      }
      public update(collection:string, document:string, data:any):Promise<void>{
        return this.firestore.collection(collection).doc(document).set(data, {merge:true});
      }
      public delete(collection:string, document:string):Promise<void>{
        return this.firestore.collection(collection).doc(document).delete();
      }

      public getAllStartAfter(collection:string, limit:number, document:DocumentData){

        return this.firestore.collection(collection,ref => ref.startAfter(document).limit(limit))
        .get().toPromise();
      
      }
      public getAll(collection:string, limit:number){

        return this.firestore.collection(collection, ref => ref.limit(limit))
        .get().toPromise();
      
      }
      public getDocChanges(collection:string, document:string){
        return this.firestore.collection(collection).doc(document).snapshotChanges();
      }

      public getPrescriptionChanges(collection:string, key1:string, value1:string, key2:string, value2:string, limit:number, orderBy:string):Observable<DocumentChangeAction<unknown>[]> {
        return this.firestore.collection(collection, ref =>
          ref.where(key1, "==", value1)
            .where(key2, "==", value2)
            .limit(limit)
            .orderBy(orderBy))
          .stateChanges();
      }


      public getCollectionList(collection: string){
          return this.firestore.collection(collection);
      }

      public getMyBookingsP(patientId:string, dateStr:string, processed:boolean, cancelled:boolean, limit:number) {

        let collectionPath: string = "queue-bookings";

        if (cancelled) {
          return this.firestore.collection(collectionPath, ref =>
            ref.where("patientId", "==", patientId)
              .where("cancelled", "==", cancelled)
              .limit(limit)
              .orderBy("bookingTimeServer")
            )
            .stateChanges();
        }
        if (processed) {
          return this.firestore.collection(collectionPath, ref =>
            ref.where("patientId", "==", patientId)
              .where("processed", "==", processed)
              .limit(limit)
              .orderBy("bookingTimeServer")
            )
            .stateChanges();
        } else {
          return this.firestore.collection(collectionPath, ref =>
            ref.where("patientId", "==", patientId)
              .where("processed", "==", processed)
              .where("dateString", "==", dateStr)
              .where("cancelled", "==", cancelled)
              .limit(limit)
              .orderBy("bookingTimeServer")
            )
            .stateChanges();
        }
      
      }

      public setObject(object: any){
        return Object.assign({}, object);
      }

      public getObject(to: any, from: any){
        return Object.assign(to, from);
      }
}
