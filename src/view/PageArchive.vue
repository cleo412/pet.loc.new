<template>
  <Page
    :employees="employees"
    :isMain="isMain"
    :message="message"
  >

    <template #pageHeader>
      <PageHeader>

        <template #inputArchiveSearch>
          <input
            id="search"
            type="text"
            ref="archiveSearch"
            aria-label="поле поиска"
            placeholder="Поиск..."
            v-model="inputValue"
            @input="filterArchiveData"
          />
        </template>

      </PageHeader>
    </template>

  </Page>
</template>

<script>
import { useEmplStore } from "@/stores/EmplStore";
import { mapState, mapActions } from "pinia";

import Page from "@/components/Page.vue";
import PageHeader from "@/components/PageHeader.vue";

export default {
  components: { Page, PageHeader },

  data() {
    return {
      employees: [],
      inputValue: "",
      message: "",
      isMain: false
    };
  },

  created() {
    this.archiveDataToStore();
    this.inputValue = this.$route.query.value;
  },

  mounted() {
    this.$refs.archiveSearch.focus();
  },

  computed: {
    ...mapState(useEmplStore, ["getEmptyStoreEmpl", "dataGetBackend", "dataPutBackend"])
  },

  methods: {
    ...mapActions(useEmplStore, ["setMessage", "formatStoreData"]),

    async archiveDataToStore() {
      try {
        if (this.getEmptyStoreEmpl("archive")) {
          await this.dataGetBackend("archive", "getArchiveUrl");
        }
        this.employees = await this.formatStoreData("archive");

        this.message = await this.setMessage("archive");
      } catch (error) {
        this.message = `Ошибка  ${error}`;
      }
    },

    filterArchiveData() {
      let archiveEmployees = this.formatStoreData("archive");

      this.employees = this.inputValue ?
        archiveEmployees.filter((elem) =>
          elem["last_name"].toLowerCase().startsWith(this.inputValue.toLowerCase()))
        : archiveEmployees;

      this.$router.push({ name: "archive", query: { value: this.inputValue } });
    }
  }
};
</script>

<style scoped>
#search {
  width: 60%;
}
</style>

