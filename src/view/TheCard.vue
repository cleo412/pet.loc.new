<script setup>
import { useEmplStore } from "../stores/EmplStore";
import { RouterLink } from "vue-router";
import { mapState, mapActions } from "pinia";
import { vMaska } from "maska";

import ThePopup from "../components/ThePopup.vue";
import IconEdit from "../components/icons/IconEdit.vue";
import IconClose from "../components/icons/IconClose.vue";
</script>

<template>
  <form class="card-form" id="add-employee" @submit.prevent>
    <fieldset class="card-form__fullname" :disabled="!isEdit">
      <img
        class="card-form__photo"
        :alt="`id: ${employee.id}`"
        :src="employee.src"
        width="110"
        height="110"
      />

      <div class="card-form__wrapper">
        <label for="last_name">Фамилия:</label>
        <input
          id="last_name"
          type="text"
          aria-label="фамилия сотрудника"
          tabindex="2"
          ref="lastName"
          v-model="employee.last_name"
          required
        />
      </div>

      <div class="card-form__wrapper">
        <label for="first_name">Имя:</label>
        <input
          id="first_name"
          type="text"
          aria-label="имя сотрудника"
          tabindex="3"
          v-model="employee.first_name"
          required
        />
      </div>

      <div class="card-form__wrapper">
        <label for="middle_name">Отчество :</label>
        <input
          id="middle_name"
          type="text"
          aria-label="отчество сотрудника"
          tabindex="4"
          v-model="employee.middle_name"
        />
      </div>
    </fieldset>

    <fieldset class="card-form__contacts" :disabled="!isEdit">
      <fieldset>
        <div class="card-form__wrapper card-form__wrapper-min">
          <label for="id_employee">ID:</label>
          <input
            id="id_employee"
            type="text"
            aria-label="id сотрудника"
            v-model="employee.id"
            disabled
          />
        </div>

        <div class="card-form__wrapper card-form__wrapper-min">
          <label for="gender">Пол:</label>
          <select
            id="gender"
            aria-label="пол сотрудника"
            tabindex="5"
            v-model="employee.gender"
          >
            <option selected disabled>Выберите вариант</option>
            <option>Мужской</option>
            <option>Женский</option>
            <option>Неизвестный</option>
          </select>
        </div>

        <div class="card-form__wrapper card-form__wrapper-min">
          <label for="born">ДР:</label>
          <input
            id="born"
            type="text"
            aria-label="день рождения сотрудника"
            tabindex="6"
            v-model="employee.birthday"
            v-maska
            data-maska="##.##"
          />
        </div>
      </fieldset>

      <fieldset>
        <div class="card-form__wrapper">
          <label for="phone">Внутренний:</label>
          <input
            id="phone"
            type="text"
            aria-label="phone"
            tabindex="7"
            v-model="employee.telephone"
            v-maska
            data-maska="##-##"
          />
        </div>

        <div class="card-form__wrapper">
          <label for="mobile">Мобильный:</label>
          <input
            id="mobile"
            type="text"
            aria-label="мобильный номер сотрудника"
            tabindex="8"
            v-model="employee.mobile"
            v-maska
            data-maska="### ###-##-##"
          />
        </div>

        <div class="card-form__wrapper">
          <label for="email">Эл. почта:</label>
          <input
            id="email"
            type="text"
            aria-label="email сотрудника"
            tabindex="9"
            v-model="employee.email"
          />
        </div>
      </fieldset>
    </fieldset>

    <fieldset :disabled="!isEdit">
      <div class="card-form__wrapper">
        <label for="company">Город:</label>
        <input
          id="city"
          type="text"
          aria-label="город проживания сотрудника"
          tabindex="10"
          v-model="employee.city"
        />
      </div>

      <div class="card-form__wrapper">
        <label for="company">Компания:</label>
        <input
          id="company"
          type="text"
          aria-label="город, в котором работает сотрудник"
          tabindex="11"
          v-model="employee.company"
        />
      </div>

      <div class="card-form__wrapper">
        <label for="department">Отдел:</label>
        <input
          id="department"
          type="text"
          aria-label="департамент, в котором работает сотрудник"
          tabindex="12"
          v-model="employee.department"
        />
      </div>

      <div class="card-form__wrapper">
        <label for="position">Должность:</label>
        <input
          id="position"
          type="text"
          aria-label="должность сотрудника"
          tabindex="13"
          v-model="employee.title"
        />
      </div>
    </fieldset>

    <div class="container__button">
      <button
        tabindex="0"
        type="button"
        class="button"
        aria-label="кнопка редактирования данных сотрудника"
        @click="isOpen = true"
      >
        <IconEdit />
      </button>

      <RouterLink class="link" :to="{ name: 'main' }" tabindex="-1">
        <button
          type="submit"
          class="button"
          tabindex="14"
          aria-label="кнопка сохранения данных и перехода на главную страницу"
          @click="onSaveEmployee(employee.id)"
        >
          <IconClose />
        </button>
      </RouterLink>

      <ThePopup :is-open="isOpen" @ok="popupConfirm" @close="isOpen = false"
        >Вы хотите изменить данные сотрудника?
      </ThePopup>
    </div>
  </form>
</template>

<script>
export default {
  components: { ThePopup },

  data() {
    return {
      employee: {},
      paramsId: null,
      isEdit: false,
      isOpen: false,
    };
  },

  created() {
    const paramsId = this.$route.params.id;

    this.employee = this.getEmplById(paramsId);
  },

  computed: {
    ...mapState(useEmplStore, ["getEmplById", "getAllEmployees"]),
  },

  methods: {
    ...mapActions(useEmplStore, ["delEmployee", "addEmployee"]),

    onSaveEmployee(paramsId) {
      this.isEdit = false;
      this.delEmployee(paramsId);
      this.addEmployee(this.employee);
    },

    popupConfirm() {
      this.isOpen = false;

      this.$nextTick(() => {
        this.$refs.lastName.focus();
      });

      this.isEdit = true;
    },
  },
};
</script>

<style scoped>
.card-form {
  display: grid;
  gap: 20px;

  background-color: var(--vt-c-white-mute);
  box-shadow: 4px 4px 4px 0 var(--vt-c-active-4);
  border-radius: 20px;

  max-width: 768px;
  padding: 35px;
  margin: 30px auto;
}

fieldset {
  display: grid;
  border: none;
  gap: 10px;
  margin: 0;
}

.card-form__wrapper {
  display: grid;
  grid-template-columns: 90px auto;
  align-content: center;
}

.card-form__wrapper-min {
  grid-template-columns: 35px auto;
}

.card-form__fullname {
  grid-template-columns: 120px 1fr;
}

.card-form__photo {
  grid-row: 1/4;
  background-color: var(--vt-c-white-background);
  border-radius: 20%;
  border: 5px solid var(--vt-c-active-2);
  box-shadow: 3px 3px 4px 1px var(--vt-c-active-4);
  margin-right: 10px;
}

.card-form__contacts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
}
@media (max-width: 767px) {
  .card-form {
    border-radius: 0;
    margin: 0;
  }
}
</style>