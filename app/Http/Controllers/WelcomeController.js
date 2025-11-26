import Welcome from "../../Models/WelcomeModel.js";

export default class WelcomeController {
  async index(req, res) {
    try {
      const data = await Welcome.all();
      res.render("welcome", { data });
    } catch (error) {
      console.log(error);
    }
  }
}
