<template>
  <div
    :class="!isMain  ? 'color-theme__secondary' : 'color-theme__main'"
    class="footer"
  >

    <span
      :class="{ tooltip: isTooltip, 'tooltip-position': isTooltip}"
      data-name="настройки">
         <PageButton
           aria-label="настройки"
           @click="isSettings=true"
         >
      <IconSettings />
         </PageButton>
      </span>

    <RouterLink :to="{ name: 'login' }">
           <span
             :class="{ tooltip: isTooltip, 'tooltip-position': isTooltip}"
             data-name="вход&nbsp;для&nbsp;HR">
              <PageButton aria-label="вход для HR">
        <IconHR />
              </PageButton>
           </span>
    </RouterLink>

    <PageMenu
      :isSettings="isSettings"
      @close="isSettings=false" />

  </div>
</template>

<script>
import IconSettings from "@/components/icons/IconSettings.vue";
import IconHR from "@/components/icons/IconHR.vue";
import PageButton from "@/components/UI/PageButton.vue";
import PageMenu from "@/components/PageMenu.vue";

import { useKeyStore } from "@/stores/KeyStore";
import { mapState } from "pinia";


export default {
  name: "PageFooter.vue",
  components: { IconSettings, IconHR, PageButton, PageMenu },

  data() {
    return {
      isSettings: false,
      isTooltip: null
    };
  },

  props: {
    isMain: Boolean
  },

  created() {
    this.isTooltip = this.getStoreKey()["isTooltip"];
    // console.log(this.isTooltip);
  },

  watch: {
    isTooltip() {
      this.isTooltip = this.getStoreKey()["isTooltip"];
    }
  },

  computed: {
    ...mapState(useKeyStore, ["getStoreKey"])
  }

};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: end;
  gap: 20px;
  border-radius: 8px;
  padding: 12px;
}

.tooltip-position:hover::after {
  bottom: 40px;
  right: 0;
}
</style>