import { defineStore } from "pinia";

export const useEmplStore = defineStore("EmplStore", {
  state: () => {
    return {
      employees: new Map(),
      archive: new Map(),
      slidersCarousel: [],
      imageUrl: "https://saa.44321.ru/assets/img/",
      serverUrl: "https://saa.44321.ru/",
      getBasicUrl: "get.php",
      putBasicUrl: "put.php",
      getArchiveUrl: "get_arch.php",
      putArchiveUrl: "put_arch.php",
      flags: { isAlphabet: false, isTooltip: true, isColorTheme: false },
      isAlphabet: false,
      isTooltip: true,
      isColorTheme: false,
    };
  },

  getters: {
    getEmptyStoreEmpl: (state) => (key) =>
      !state[key] ? true : state[key].size === 0,

    getStoreEmpl: (state) => () => state,

    getKeyInStoreEmpl: (state) => (key) => state[key],

    getEmployeeById: (state) => (key, id) => state[key].get(id),
  },

  actions: {
    giveTodayDate() {
      let day = String(new Date().getDate());
      day.length === 1 ? (day = "0" + day) : day;

      let month = String(new Date().getMonth() + 1);
      month.length === 1 ? (month = "0" + month) : month;

      return day + month;
    },

    // взять с сервера
    async dataGetBackend(key, url) {
      try {
        let response = await fetch(
          this.getKeyInStoreEmpl("serverUrl") + this.getKeyInStoreEmpl(url),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let data = await response.json();

        for (let elem of data) {
          elem.gender === "m"
            ? (elem.gender = "мужской")
            : elem.gender === "f"
            ? (elem.gender = "женский")
            : (elem.gender = "неизвестный");

          if (key === "employees") {
            elem.thumbnail =
              elem.thumbnail === false
                ? (await this.getKeyInStoreEmpl("imageUrl")) +
                  `defaultPhoto.jpg`
                : (await this.getKeyInStoreEmpl("imageUrl")) + `${elem.id}.jpg`;
          } else {
            elem.thumbnail =
              (await this.getKeyInStoreEmpl("imageUrl")) + `defaultPhoto.jpg`;
          }
        }
        this[key] = new Map();
        data.forEach((elem) => this[key].set(elem.id, elem));
      } catch (error) {
        console.error(error);
      }
    },

    // отправить на сервер
    async dataPutBackend(key, url) {
      // тяну из  state массив сотрудников
      let arr = [...(await this.getKeyInStoreEmpl(key).values())];

      // возвращаю в нужный формат поле "пол" сотрудника
      for (let elem of arr) {
        elem.gender === "мужской"
          ? (elem.gender = "m")
          : elem.gender === "женский"
          ? (elem.gender = "f")
          : (elem.gender = "u");

        // возвращаю в нужный формат поле "миниатюра(фото)" сотрудника
        if (key === "employees") {
          elem.thumbnail =
            elem.thumbnail !==
            this.getKeyInStoreEmpl("imageUrl") + `defaultPhoto.jpg`;
        }
      }

      try {
        let promise = await fetch(
          this.getKeyInStoreEmpl("serverUrl") + this.getKeyInStoreEmpl(url),
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: JSON.stringify(arr),
          }
        );
      } catch (error) {
        console.error(error);
      }
    },

    // для алфавитной сортировки
    formatStoreData(key) {
      return !this.isAlphabet
        ? this.alphabetSortStart([...this.getKeyInStoreEmpl(key).values()])
        : this.alphabetSortEnd([...this.getKeyInStoreEmpl(key).values()]);
    },

    setMessage(key) {
      return (this.message =
        this.getKeyInStoreEmpl(key).size === 0
          ? "Список сотрудников пуст"
          : "Нет сотрудников, соответствующих вашему поиску");
    },

    // сохранить уволенного в архиве
    async saveInArchive(id) {
      try {
        if (this.getEmptyStore("archive")) {
          await this.dataGetBackend("archive", "getArchiveUrl");
        }
        this.message = this.setMessage("archive");
      } catch (error) {
        this.message = `Ошибка  ${error}`;
      }
      // нахожу удаляемого в архив сотрудника
      let delEmployee = this.getEmployeeById("employees", id);

      // меняю его фото на дефолтное и делаю неактивным ( поле hide)
      delEmployee.thumbnail =
        this.getKeyInStoreEmpl("imageUrl") + `defaultPhoto.jpg`;
      delEmployee.hide = true;

      // добавляю его в архив
      await this.getKeyInStoreEmpl("archive").set(id, delEmployee);

      // отправляю инфу на сервер об удаляемом в архив сотруднике
      await this.dataPutBackend("archive", "putArchiveUrl");
    },

    delEmployee(id) {
      this.employees.delete(id);
    },

    // !!! тут нужно подумать как буде формироваться ID сотрудника
    createNextId() {
      return this.getEmptyStore("employees")
        ? "1"
        : String(Number(Math.max(...this.employees.keys())) + 200); // пока +200 к последнему  ID
    },

    createEmployee: function () {
      const idEmployee = this.createNextId();

      let employee = {
        id: idEmployee,
        name: "",
        hide: true,
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
        thumbnail: this.getKeyInStoreEmpl("imageUrl") + `defaultPhoto.jpg`,
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

    alphabetSortStart(obj) {
      return obj.sort((a, b) => a.cn.localeCompare(b.cn));
    },

    alphabetSortEnd(obj) {
      return obj.sort((a, b) => b.cn.localeCompare(a.cn));
    },
  },
});
