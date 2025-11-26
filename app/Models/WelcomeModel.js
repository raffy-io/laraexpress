export default class WelcomeModel {
  constructor() {
    this.data = {
      heading: "LaraExpress",
      subheading: "laravel inspired mini MVC framework",
    };
  }

  async all() {
    return this.data;
  }

  static async all() {
    return await new this().all();
  }
}
