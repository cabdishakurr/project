import { Observable } from '@nativescript/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@nativescript/firebase-auth';
import { Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
  private auth = getAuth();

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      Frame.topmost().navigate({
        moduleName: 'pages/messages/messages-page',
        clearHistory: true
      });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      Frame.topmost().navigate({
        moduleName: 'pages/messages/messages-page',
        clearHistory: true
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  }
}