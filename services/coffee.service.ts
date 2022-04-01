import {CoffeeDocument, CoffeeModel, CoffeeProps} from "../models";

export class CoffeeService{

	private static instance: CoffeeService;

	public static getInstance(): CoffeeService{
		if(CoffeeService.instance === undefined){
			CoffeeService.instance = new CoffeeService();
		}
		return CoffeeService.instance;
	}

	private constructor() {}

	public async createCoffe(props: CoffeeProps): Promise<CoffeeDocument>{
		const model = new CoffeeModel(props);
		const coffee = await model.save();
		return coffee;
	}

	async getAll(): Promise<CoffeeDocument[]> {
		return CoffeeModel.find().exec();
	}

	async get(coffee_id: string): Promise<CoffeeDocument | null> {
		return await CoffeeModel.findById(coffee_id).exec();
	}

	async deleteById(coffee_id: string): Promise<boolean> {
		const res = await CoffeeModel.deleteOne({_id: coffee_id}).exec();
		return res.deletedCount === 1;
	}

	async updateById(coffee_id: string, props: CoffeeProps): Promise<CoffeeDocument | null> {
		const coffee = await this.get(coffee_id);
		if (!coffee) {
			return null;
		}
		if (props.name !== undefined) {
			coffee.name = props.name;
		}
		if(props.origin !== undefined){
			coffee.origin = props.origin;
		}
		if(props.intensity !== undefined){
			coffee.intensity = props.intensity;
		}
		if(props.price !== undefined){
			coffee.price = props.price;
		}
		return coffee.save();
	}
}