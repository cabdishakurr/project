import { Observable } from '@nativescript/core';
import { SmsService } from '../../services/sms.service';
import { getAuth } from '@nativescript/firebase-auth';
import { Frame } from '@nativescript/core';

export class MessagesViewModel extends Observable {
  private smsService: SmsService;
  private messages: any[] = [];
  private searchQuery: string = '';

  constructor() {
    super();
    this.smsService = new SmsService();
    this.init();
  }

  async init() {
    const hasPermission = await this.smsService.requestPermissions();
    if (hasPermission) {
      await this.loadMessages();
    } else {
      alert('SMS permissions are required to use this app');
    }
  }

  async loadMessages() {
    try {
      const messages = await this.smsService.readSMS();
      const userId = getAuth().currentUser?.uid;
      
      if (userId) {
        for (const message of messages) {
          await this.smsService.storeSMSInFirebase(message, userId);
        }
      }
      
      this.set('messages', messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      alert('Failed to load messages');
    }
  }

  onFilter() {
    if (this.searchQuery) {
      const filtered = this.messages.filter(msg => 
        msg.address.includes(this.searchQuery) || 
        msg.body.includes(this.searchQuery)
      );
      this.set('messages', filtered);
    } else {
      this.loadMessages();
    }
  }

  onLogout() {
    getAuth().signOut();
    Frame.topmost().navigate({
      moduleName: 'pages/login/login-page',
      clearHistory: true
    });
  }

  onRefresh() {
    this.loadMessages();
  }
}