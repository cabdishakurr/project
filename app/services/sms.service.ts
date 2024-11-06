import { android as androidApp } from '@nativescript/core/application';
import { firebase } from '@nativescript/firebase-core';
import { getFirestore } from '@nativescript/firebase-firestore';

export class SmsService {
  private db = getFirestore();

  async requestPermissions(): Promise<boolean> {
    try {
      const permissions = require('nativescript-permissions');
      const result = await permissions.requestPermission(
        android.Manifest.permission.READ_SMS,
        "We need SMS permissions to filter and display your messages"
      );
      return result[android.Manifest.permission.READ_SMS];
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  async readSMS(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (androidApp) {
        const uri = android.net.Uri.parse("content://sms/inbox");
        const cursor = androidApp.context
          .getContentResolver()
          .query(uri, null, null, null, "date DESC");

        const messages = [];
        if (cursor) {
          while (cursor.moveToNext()) {
            const message = {
              id: cursor.getString(cursor.getColumnIndex("_id")),
              address: cursor.getString(cursor.getColumnIndex("address")),
              body: cursor.getString(cursor.getColumnIndex("body")),
              date: cursor.getLong(cursor.getColumnIndex("date")),
              type: cursor.getInt(cursor.getColumnIndex("type"))
            };
            messages.push(message);
          }
          cursor.close();
        }
        resolve(messages);
      } else {
        reject(new Error('SMS reading is only supported on Android'));
      }
    });
  }

  async storeSMSInFirebase(message: any, userId: string): Promise<void> {
    try {
      await this.db.collection('users')
        .doc(userId)
        .collection('messages')
        .add({
          ...message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
      console.error('Firestore error:', error);
      throw error;
    }
  }
}