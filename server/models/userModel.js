import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
    cart: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
            min: [1, "Quantity can't be less than 1"],
          },
          priceAtAddition: {
            type: Number,
            required: true,
          },
          addedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Order",
      default: [],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationExpire: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    address: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        fullName: {
          type: String,
          required: [true, "Full name is required"],
          trim: true,
          minlength: [2, "Full name must be at least 2 characters"],
          maxlength: [100, "Full name cannot exceed 100 characters"],
        },
        street: {
          type: String,
          required: [true, "Street address is required"],
          trim: true,
          minlength: [5, "Street address must be at least 5 characters"],
          maxlength: [200, "Street address cannot exceed 200 characters"],
        },
        city: {
          type: String,
          required: [true, "City is required"],
          trim: true,
          minlength: [2, "City must be at least 2 characters"],
          maxlength: [100, "City cannot exceed 100 characters"],
        },
        state: {
          type: String,
          required: [true, "State is required"],
          trim: true,
          minlength: [2, "State must be at least 2 characters"],
          maxlength: [100, "State cannot exceed 100 characters"],
        },
        zipCode: {
          type: String,
          required: [true, "PIN code is required"],
          trim: true,
          match: [/^\d{6}$/, "Please enter a valid 6-digit PIN code (e.g., 500001)"],
        },
        country: {
          type: String,
          default: "India",
          trim: true,
        },
        phone: {
          type: String,
          trim: true,
          match: [/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number"],
          maxlength: [20, "Phone number cannot exceed 20 characters"],
        },
        isMain: {
          type: Boolean,
          default: false,
        },
        label: {
          type: String,
          enum: ["Home", "Work", "Other", null],
          default: null,
        },
        deliveryInstructions: {
          type: String,
          maxlength: [500, "Delivery instructions cannot exceed 500 characters"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
