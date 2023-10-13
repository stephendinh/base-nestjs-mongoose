export class Animal {
  constructor(public name: string) {}
  makeSound() {
    console.log('This animal make' + this.name);
  }
}
