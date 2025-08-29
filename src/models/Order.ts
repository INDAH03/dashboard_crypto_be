import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface OrderAttributes {
  id: number;
  coinId: string;
  pair: string;
  type: "Buy" | "Sell";
  amount: number;
  price: number;
  fullname: string;
  paymentMethod: string;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "status"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes {
  public id!: number;
  public coinId!: string;
  public pair!: string;
  public type!: "Buy" | "Sell";
  public amount!: number;
  public price!: number;
  public fullname!: string;
  public paymentMethod!: string;
  public status!: "Pending" | "Completed" | "Cancelled";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    coinId: { type: DataTypes.STRING, allowNull: false },
    pair: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("Buy", "Sell"), allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    fullname: { type: DataTypes.STRING, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("Pending", "Completed", "Cancelled"),
      defaultValue: "Pending",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
  }
);

export default Order;
