import express from "express";
import { body } from "express-validator";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Validation middleware
const budgetValidation = [
  body("category").isString().withMessage("Invalid category ID"),
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("startDate").isISO8601().withMessage("Start date must be a valid date"),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

const updateBudgetValidation = [
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (
        req.body.startDate &&
        new Date(endDate) <= new Date(req.body.startDate)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

// Routes
router.use(protect); // Protect all budget routes

router.route("/").post(budgetValidation, createBudget).get(getBudgets);

router
  .route("/:id")
  .get(getBudgetById)
  .put(updateBudgetValidation, updateBudget)
  .delete(deleteBudget);

export default router;
