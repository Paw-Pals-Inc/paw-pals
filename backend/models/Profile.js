const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/database.js");

const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  profilePic: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  petName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  petAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  petGender: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  petBreed: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  petWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  petVaccinated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  petNeutered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  petGallery: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("petGallery");
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set: function (value) {
      if (typeof value === "string") {
        this.setDataValue("petGallery", value);
      } else {
        this.setDataValue("petGallery", JSON.stringify(value));
      }
    },
  },
  petTags: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("petTags");
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set: function (value) {
      if (typeof value === "string") {
        this.setDataValue("petTags", value);
      } else {
        this.setDataValue("petTags", JSON.stringify(value));
      }
    },
  },
  petDescription: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
});

module.exports = Profile;
