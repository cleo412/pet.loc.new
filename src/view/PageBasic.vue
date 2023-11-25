<template>

  <PageSpinner v-if="isReset" />

  <Page
    :employees="employees"
    :message="message"
    :amountBirthdays="getTodayBirthday()"
    :isMain="isMain"
    :isMarked="isMarked"
    @deleteEmployee="onDeleteInBasic($event)"
  >

    <template #pageMainHeader>
      <PageMainHeader
        class="page_header__main "
        :isAlphabet="isAlphabet"
        :employeesLength="employees.length"
        :message="message"
        @employeeCreate="onCreateEmployee($event)"
        @filterEmployee="onFilterBasicData($event, this.employees)"
        @resetFilter="onResetFilter"
        @alphabetSort="onAlphabetSort"
        @resetMarks="resetColorMarks($event)"
      >
      </PageMainHeader>
    </template>

  </Page>
</template>

<script>
import Page from "@/components/Page.vue";
import PageMainHeader from "@/components/PageMainHeader.vue";
import PageSpinner from "@/components/PageSpinner.vue";

import { mapState, mapActions } from "pinia";
import { useEmplStore } from "@/stores/EmplStore";

export default {
  components: { Page, PageMainHeader, PageSpinner },

  data() {
    return {
      employees: [],
      message: "",
      amountBirthdays: null,
      isMain: true,
      isAlphabet: null,
      isMarked: null,
      isReset: false,
      filteredEmployees: [],
      employeesLength: null,

      queryRoutValue: null,
      queryRoutCategory: null
    };
  },

  created() {
    this.basicDataToStore();

    this.queryRoutValue = this.$route.query.value;
    this.queryRoutCategory = this.$route.query.category;

    this.employees = this.queryRoutValue && this.queryRoutCategory
      ? this.employees.filter((elem) =>
        this.setLowerCase(String(elem[this.queryRoutCategory])) === this.setLowerCase(this.queryRoutValue))
      : this.employees;
  },

  computed: {
    ...mapState(useEmplStore, [
      "getEmptyStoreEmpl",
      "getKeyInStoreEmpl"
    ])
  },

  methods: {
    ...mapActions(useEmplStore, [
      "giveTodayDate",
      "formatStoreData",
      "dataPutBackend",
      "dataGetBackend",
      "createEmployee",
      "saveInArchive",
      "alphabetSortStart",
      "alphabetSortEnd",
      "createNextId",
      "setMessage",
      "delEmployee",
      "setToggle"
    ]),

    setLowerCase(str) {
      return str =
        str.startsWith("#")
          ? "#" + str.split("").splice(1).join("").toLowerCase()
          : typeof str !== "number"
            ? str.toLowerCase()
            : str;
    },

    // для форматирование данных с сервера и их сортировка  (нужно в Page)
    async basicDataToStore() {
      try {
        if (this.getEmptyStoreEmpl("employees")) {
          await this.dataGetBackend("employees", "getBasicUrl");
        }
        this.employees = this.formatStoreData("employees");

        this.message = this.setMessage("employees");
      } catch (error) {
        this.message = `Ошибка  ${error}`;
      }
    },

    // для  кол-ва именинников на сегодняшнюю дату (PageBar стр. 12)
    getTodayBirthday() {
      let todayDate = this.giveTodayDate();
      return this.amountBirthdays = ([...this.getKeyInStoreEmpl("employees").values()].filter(
        (elem) => elem["birthday"] === todayDate).length);
    },

    // для проверки работы спиннера без сервера
    resetColorMarks(event) {
      setTimeout(() => {
        this.isReset = true;
        this.isMarked = event.mark;
      }, 4444);
    },

    // для сортировки данных по категории ( из PageMainHeader)
    onFilterBasicData(event) {
      this.employees = event.category && event.value
        ? this.employees.filter((elem) =>
          this.setLowerCase(String(elem[event.category])) === this.setLowerCase(event.value))
        : this.employees;

      this.message = this.setMessage("employees");
      this.filteredEmployees = this.employees;
    },

    // для алфавитной сортировки данных
    sortingAlphabet(obj) {
      if (!this.isAlphabet && !this.filteredEmployees.length) {
        return this.employees = this.alphabetSortStart(obj);

      } else if (this.isAlphabet && !this.filteredEmployees.length) {
        return this.employees = this.alphabetSortEnd(obj);

      } else if (!this.isAlphabet && this.filteredEmployees.length) {
        return this.employees = this.alphabetSortStart(this.filteredEmployees);

      } else if (this.isAlphabet && this.filteredEmployees.length) {
        return this.employees = this.alphabetSortEnd(this.filteredEmployees);
      }
    },

    // переключение сортировки от А-Я  в  Я-А
    onAlphabetSort() {
      this.isAlphabet = this.setToggle("isAlphabet");
      this.sortingAlphabet(this.employees);
    },

    // сброс фильтра по категории
    onResetFilter() {
      this.filteredEmployees = [];
      this.employees = this.formatStoreData("employees");
    },

    // удаление сотрудника в архив
    async onDeleteInBasic(event) {
      await this.saveInArchive(event.id);

      await this.delEmployee(event.id);

      this.filteredEmployees.length
        ? this.filteredEmployees.splice(
          this.filteredEmployees.indexOf(
            this.employees.find(elem => elem.id === event.id)), 1)

        : this.employees = this.employees.filter(elem => elem.id !== event.id);

      this.message = "";

      // отправляю на сервер
      await this.dataPutBackend("employees", "putBasicUrl");

      // обновляю с сервера в сторе
      await this.dataGetBackend("employees", "getBasicUrl");

      // забираю массив сотрудников из стора (state) в алфавитном порядке
      this.employees = this.formatStoreData("employees");
    },

    // создание нового сотрудника
    onCreateEmployee() {
      const id = this.createNextId();

      this.$router.push({
        name: "newCard",
        params: { id: id }
      });

      this.createEmployee();
    }
  }
};
</script>
