import express, { Application } from "express";
import { AdminRoutes, CustomerRoute, DeliveryRoute, ShoppingRoute, VendorRoutes } from "../routes";
import path from "path";

export default async (app: Application) => {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/images", express.static(path.join(__dirname, "../images")));

  app.use("/admin", AdminRoutes);
  app.use("/vendor", VendorRoutes);
  app.use("/customer", CustomerRoute);
  app.use('/delivery', DeliveryRoute)

  app.use(ShoppingRoute);

  return app;

}


