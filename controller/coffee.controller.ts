import express, {Request, Response, Router} from "express";
import {Mongoose} from "mongoose";
import {CoffeeModel} from "../models";
import {CoffeeService} from "../services";

export class CoffeeController{

	async createCoffee(req: Request, rep: Response){
		const coffeeUser = req.body;
		if(!coffeeUser.name || !coffeeUser.intensity || !coffeeUser.price){
			rep.status(400).end();
			return;
		}
		const coffee = await CoffeeService.getInstance().createCoffe({
			name: coffeeUser.name,
			intensity: coffeeUser.intensity,
			price: coffeeUser.price,
			origin: coffeeUser.origin
		})
		rep.json(coffee);
	}

	async getAllCoffees(req: Request, rep: Response){
		const coffees = await CoffeeService.getInstance().getAll();
		rep.json(coffees);
	}

	async getCoffee(req: Request, rep: Response){
		try {
			const coffee = await CoffeeService.getInstance().get(req.params.coffee_id);
			if (coffee === null) {
				rep.status(404).end();
				return;
			}
			rep.json(coffee);
		}catch (err){
			rep.status(400).end();
			return;
		}
	}

	async deleteCoffee(req: Request, rep: Response){
		try {
			const success = await CoffeeService.getInstance().deleteById(req.params.coffee_id);
			if (success) {
				rep.status(204).end();
				return;
			} else {
				rep.status(404).end();
			}
		}catch(err){
			rep.status(400).end();
		}
	}

	async updateCoffee(req: Request, rep: Response){
		const coffee = await CoffeeService.getInstance().updateById(req.params.coffee_id, req.body);
		if(!coffee){
			rep.status(400)
		}
	}

	buildRoutes(): Router{
		const router = express.Router();
		router.post("/", express.json(), this.createCoffee.bind(this));
		router.get("/", this.getAllCoffees.bind(this));
		router.get("/:coffee_id", this.getCoffee.bind(this));
		router.delete("/:coffee_id", this.deleteCoffee.bind(this));
		router.put("/:coffee_id", express.json(), this.updateCoffee.bind(this));
		return router;
	}

}