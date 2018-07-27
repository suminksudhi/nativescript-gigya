import { Observable } from 'tns-core-modules/data/observable';
import { Gigya } from 'nativescript-gigya';

export class HelloWorldModel extends Observable {
  public message: string;
  private gigya: Gigya;

  constructor() {
    super();

    this.gigya = new Gigya();
    this.message = this.gigya.message;
  }
}
