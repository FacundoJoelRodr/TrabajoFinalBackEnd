export default class UserDTO {
    constructor(user) {
      this.id = user.id;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email = user.email;
      this.carts = user.carts;
      this.age = user.age || 1;
      this.role = user.role || 'user';
    }
  }
  