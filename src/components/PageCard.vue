<template>

  {{ isTooltip }}

  <div class="wrapper">
    <form
      class="card-form"
      id="add-employee"
      @submit.prevent="sendForm"
    >

      <div
        class="card-form__uploader"
        @mouseover="upload = true && isEdit"
        @mouseleave="upload = false"
      >

        <label v-if='upload && employeePhoto === ""'>
          <IconUpload
            class="card-form__uploader-icon"
          />

          <input
            type="file"
            id="uploaderInput"
            ref="uploaderInput"
            @change="uploadPhoto"
          />
        </label>

        <img
          class="card-form__photo"
          :class="{ status: employee['hide'] }"
          :alt="`id: ${employee['id']}`"
          :src="employee['thumbnail']"
          width="110"
          height="110"
        />

      </div>

      <fieldset class="card-form__full-name" :disabled="!isEdit">
        <label class="card-form__label card-form__label-required"
        >Фамилия*
          <input
            id="last_name"
            type="text"
            aria-label="фамилия сотрудника"
            tabindex="2"
            ref="lastName"
            v-model.trim="employee['last_name']"
          />
        </label>

        <label class="card-form__label card-form__label-required">Имя*
          <input
            id="first_name"
            type="text"
            aria-label="имя сотрудника"
            tabindex="3"
            ref="firstName"
            v-model.trim="employee['first_name']"
          />
        </label>

        <label class="card-form__label">Отчество
          <input
            id="middle_name"
            type="text"
            aria-label="отчество сотрудника"
            tabindex="4"
            v-model.trim="employee['middle_name']"
          />
        </label>
      </fieldset>

      <fieldset class="card-form__personal" :disabled="!isEdit">
        <label class="card-form__label">ID
          <input
            id="id_employee"
            type="text"
            aria-label="id сотрудника"
            tabindex="-1"
            v-model.trim="employee['id']"
            disabled
          />
        </label>

        <label class="card-form__label">Пол
          <select
            id="gender"
            aria-label="пол сотрудника"
            tabindex="5"
            v-model.trim="employee['gender']"
          >
            <option selected disabled>Выберите вариант</option>
            <option>мужской</option>
            <option>женский</option>
            <option>неизвестный</option>
          </select>
        </label>

        <label class="card-form__label">ДР
          <input
            id="birthday"
            type="text"
            aria-label="день рождения сотрудника"
            tabindex="6"
            v-model.trim="employee['birthday']"
            v-maska="maskaBirthday"
            data-maska="##.##"
          />
        </label>
      </fieldset>

      <fieldset class="card-form__contacts" :disabled="!isEdit">
        <label class="card-form__label">Вн. тел.
          <input
            id="telephone"
            type="text"
            aria-label="внутренний номер сотрудника"
            tabindex="7"
            v-model.trim="employee['telephone']"
            v-maska="maskaTelephone"
            data-maska="##-##"
          />
        </label>

        <label class="card-form__label">Моб. тел.
          <input
            id="mobile"
            type="text"
            aria-label="мобильный номер сотрудника"
            tabindex="8"
            v-model.trim="employee['mobile']"
            v-maska="maskaMobile"
            data-maska="### ###-##-##"
          />
        </label>

        <label class="card-form__label">Email
          <input
            id="email"
            type="email"
            aria-label="email сотрудника"
            tabindex="9"
            v-model.trim="employee['email']"
          />
        </label>
      </fieldset>

      <fieldset class="card-form__address" :disabled="!isEdit">
        <label class="card-form__label">Город
          <input
            id="city"
            type="text"
            aria-label="город проживания сотрудника"
            tabindex="10"
            ref="city"
            v-model.trim="employee['city']"
            required
          />
        </label>

        <label class="card-form__label">Компания
          <input
            id="company"
            type="text"
            aria-label="компания, в которой работает сотрудник"
            tabindex="11"
            v-model.trim="employee['company']"
          />
        </label>

        <label class="card-form__label">Отдел
          <input
            id="department"
            type="text"
            aria-label="департамент, в котором работает сотрудник"
            tabindex="12"
            v-model.trim="employee['department']"
          />
        </label>

        <label class="card-form__label">Должность
          <input
            id="title"
            type="text"
            aria-label="должность сотрудника"
            tabindex="13"
            v-model.trim="employee['title']"
          />
        </label>

        <label class="card-form__label">Хэштег
          <input
            id="hashtag"
            type="text"
            aria-label="хэштег"
            class="card-form__hashtag"
            tabindex="14"
            v-model.trim="employee['hashtag']"
          />
        </label>
      </fieldset>

      <template v-if="!isMain">
        <p class="card-form__explanations">* обязательное поле для ввода</p>
      </template>

      <div class=" card-form__buttons">
        <template v-if="!isMain">
        <span
          :class="{ tooltip: isTooltip, 'tooltip-position': isTooltip}"
          data-name="редактировать"
        >
          <PageColorButton
            tabindex="0"
            aria-label="кнопка редактирования данных сотрудника"
            @click="isOpenEdit = true"
          >
            <IconEdit />
          </PageColorButton>
        </span>

          <span
            :class="{ tooltip: isTooltip, 'tooltip-position': isTooltip}"
            data-name="сохранить">
          <PageColorButton
            tabindex="15"
            aria-label="кнопка сохранения данных сотрудника"
            @click="onSaveEmployee(employee['id'])"
          >
            <IconSave />
          </PageColorButton>
        </span>
        </template>

        <span
          :class="{ tooltip: isTooltip, 'tooltip-position': isTooltip}"
          data-name="выйти">
        <PageColorButton
          tabindex="isMain ? '16': '1'"
          aria-label="кнопка выхода"
          :disabled="!sendForm"
          @click=" this.$router.go(-1)"
        >
          <IconGoTo />
        </PageColorButton>
      </span>
      </div>
    </form>

    <PagePopup
      :is-open="isOpenEdit"
      @ok="popupConfirm"
      @close="isOpenEdit = false"
    >
      Вы хотите изменить данные сотрудника?
    </PagePopup>
  </div>
</template>

<script>
import { useEmplStore } from "@/stores/EmplStore";
import { useKeyStore } from "@/stores/KeyStore";
import { mapState, mapActions } from "pinia";
import { vMaska } from "maska";

import PagePopup from "@/components/PagePopup.vue";
import PageColorButton from "@/components/UI/PageColorButton.vue";

import IconUpload from "@/components/icons/IconUpload.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconSave from "@/components/icons/IconSave.vue";
import IconGoTo from "@/components/icons/IconGoTo.vue";

export default {
  components: { PagePopup, PageColorButton, IconUpload, IconEdit, IconSave, IconGoTo },
  directives: { maska: vMaska },

  props: {
    employee: Object,
    isEdit: Boolean,
    isMain: Boolean
  },

  data() {
    return {
      paramsId: null,
      isOpenEdit: false,
      tabindex: 1,

      maskaBirthday: {
        masked: "",
        unmasked: "",
        completed: false
      },

      maskaTelephone: {
        masked: "",
        unmasked: "",
        completed: false
      },

      maskaMobile: {
        masked: "",
        unmasked: "",
        completed: false
      },

      upload: null,
      employeePhoto: "",
      isTooltip: null
    };
  },

  created() {
    this.isTooltip = this.getStoreKey()["isTooltip"];
    console.log(this.isTooltip);
  },

  mounted() {
    this.$refs.lastName.focus();
  },

  computed: {
    ...mapState(useKeyStore, ["getStoreKey"]),

    sendForm() {
      return (this.employee.last_name && this.employee.first_name);
    }
  },

  methods: {
    ...mapActions(useEmplStore, [
      "delEmployee",
      "addEmployee",
      "dataPutBackend",
      "dataGetBackend"
    ]),

    uploadPhoto() {
      this.employeePhoto = this.$refs.uploaderInput.files[0];
    },

    setRequiredField() {
      [this.$refs.lastName, this.$refs.firstName].map(elem => !elem.value
        ? elem.style.border = "2px solid var(--vt-c-alert-7)"
        : elem.style.border = "none");
    },

    getUnmaskedEmployee() {
      const unmaskedEmployee = { ...this.employee };
      unmaskedEmployee.birthday = this.maskaBirthday.unmasked;
      unmaskedEmployee.telephone = this.maskaTelephone.unmasked;
      unmaskedEmployee.mobile = this.maskaMobile.unmasked;
      return unmaskedEmployee;
    },

    async onSaveEmployee(paramsId) {
      this.setRequiredField();

      this.$emit("editNo");
      this.delEmployee(paramsId);

      this.addEmployee(this.getUnmaskedEmployee());

      // отправляю на сервер
      await this.dataPutBackend("employees", "putBasicUrl");

      // обновляю с сервера в сторе
      await this.dataGetBackend("employees", "getBasicUrl");
    },

    popupConfirm() {
      this.isOpenEdit = false;

      this.$nextTick(() => {
        this.$refs.lastName.focus();
      });

      this.$emit("editOk");
    }
  }
};
</script>

<style scoped>
.card-form {
  display: grid;
  grid-template-columns: min-content min-content auto;
  gap: 30px;

  max-width: 768px;
  background-color: var(--vt-c-white-mute);
  box-shadow: 4px 4px 4px 0 var(--vt-c-active-2);
  border-radius: 20px;
  padding: 5%;
  margin: 30px auto;
}

.card-form__label {
  display: grid;
  grid-template-columns: 85px 1fr;
  align-items: center;
}

.card-form__label-required {
  font-weight: bold;
}

.card-form__uploader {
  position: relative;
  margin: 0 auto;
}

input[type="file"] {
  position: absolute;
  top: 10px;
  left: 5px;
  width: 70px;
  height: 80px;
  opacity: 0;
}

.card-form__uploader-icon {
  position: absolute;
  top: calc(50% - 13px);
  left: calc(50% - 13px);
  z-index: 999;
}

.card-form__photo {
  background-color: var(--vt-c-white-background-confirm);
  box-sizing: border-box;
  border-radius: 20%;
  border: 3px solid var(--vt-c-active-2);
  box-shadow: 2px 3px 4px 1px var(--vt-c-active-9);
}

.card-form__full-name {
  grid-column: 2 / 4;
}

.card-form__personal {
  grid-column: 1 / 3;
}

.card-form__address {
  grid-column: 1 / -1;
}

.card-form__hashtag {
  width: 23%;
}

.card-form__explanations {
  grid-area: 4/1/5/3;
  font-weight: bold;
  margin: 10px;
}

.card-form__buttons {
  grid-area: 4/3/5/4;

  display: flex;
  justify-content: end;
  column-gap: 10%;
  padding: 0 15px;
}

.tooltip-position:hover::after {
  left: 0;
}

@media screen and (max-width: 767px) {
  .card-form {
    display: flex;
    flex-direction: column;
    border-radius: 0;
    margin: 0;
  }

  .card-form__buttons {
    justify-content: space-around;
    margin: 0 auto;
  }
}
</style>
