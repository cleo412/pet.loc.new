import { defineStore } from "pinia";
import employeesArchive from "@/data/employeesArchive.json";

export const useEmplStore = defineStore("EmplStore", {
  state: () => {
    return {
      employees: new Map(),
      archive: new Map(),
      isAlphabet: true,
    };
  },
  getters: {
    getEmptyStore: (state) => (key) =>
      !state[key] ? true : state[key].size === 0,

    getAlphabet: (state) => state["isAlphabet"],

    getAllEmployeesArray: (state) => (key) => state[key].values(),

    getAllEmployeesMap: (state) => (key) => state[key],

    getEmployeeById: (state) => (employeeId) =>
      state["employees"].get(employeeId),

    getAlertBirthday:
      (state) =>
      (date, sum = 0) => {
        [...state["employees"].values()].forEach((elem) =>
          elem.birthday === date ? sum++ : sum
        );
        return sum;
      },
  },

  actions: {
    setGender(data) {
      data.forEach((elem) =>
        elem.gender === "m"
          ? (elem.gender = "Мужской")
          : elem.gender === "f"
          ? (elem.gender = "Женский")
          : (elem.gender = "Неизвестный")
      );
    },

    setImage(data) {
      data.forEach((elem) =>
        elem.thumbnail === false
          ? (elem.src = `./src/assets/img/defaultPhoto.jpg`)
          : (elem.src = `./src/assets/img/${elem.id}.jpg`)
      );
    },

    setMapEmployees(data, key) {
      this.setGender(data);
      this.setImage(data);

      this[key] = new Map();
      data.forEach((elem) => this[key].set(elem.id, elem));

      return this[key];
    },

    saveInArchive(id) {
      this.archive = this.getEmptyStore("archive")
        ? this.setMapEmployees(employeesArchive, "archive")
        : this.archive;

      let delEmployee = this.getEmployeeById(id);
      this.archive.set(id, delEmployee);

      this.delEmployee(id);
    },

    delEmployee(id) {
      this.employees.delete(id);
    },

    createNextId() {
      return this.getEmptyStore("employees")
        ? "1"
        : String(Number(Math.max(...this.employees.keys())) + 1);
    },

    createEmployee: function () {
      const idEmployee = this.createNextId();

      let employee = {
        id: idEmployee,
        name: "",
        hide: true,
        thumbnail: false,
        gender: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        birthday: "",
        email: "",
        cn: "",
        telephone: "",
        mobile: "",
        title: "",
        department: "",
        company: "",
        city: "",
        src: `./src/assets/img/defaultPhoto.jpg`,
      };

      this.employees.set(idEmployee, employee);
    },

    addEmployee(updatedEmpl) {
      updatedEmpl.cn =
        updatedEmpl.last_name +
        " " +
        updatedEmpl.first_name +
        " " +
        updatedEmpl.middle_name;

      this.employees.set(updatedEmpl.id, updatedEmpl);
    },

    alphabetToggle() {
      return (this.isAlphabet = !this.isAlphabet);
    },
  },
});
