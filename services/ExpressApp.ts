import express, { Application } from "express";
import { AdminRoutes, VendorRoutes } from "../routes";
import path from "path";
import { ShoppingRoute } from "../routes/ShoppingRoute";

export default async (app: Application) => {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/admin", AdminRoutes);
  app.use("/vendor", VendorRoutes);

  app.use(ShoppingRoute);

  return app;

}


