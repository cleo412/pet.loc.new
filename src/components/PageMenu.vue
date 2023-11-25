<template>
  <div class="wrapper">
    <transition-group name="animation">
      <ul class="menu" v-if="isSettings">

        <IconClose
          class="menu__close"
          @click="closeMenu" />

        <li class="menu__item">
          <PageButton
            @click="isTooltip = setToggle('isTooltip')"
          >
           <span v-show="!isTooltip">
           <IconTooltip />
             </span>

            <span v-show="isTooltip">
           <IconTooltipOff />
             </span>
          </PageButton>

          <p v-show="isTooltip">Удалить подсказки</p>
          <p v-show="!isTooltip">Добавить подсказки</p>

        </li>

        <li class="menu__item">
          <PageButton
            @click="isColorTheme = setToggle('isColorTheme')"
          >
            <span v-show="isColorTheme">
              <IconSun />
            </span>

            <span v-show="!isColorTheme">
              <IconMoon />
            </span>
          </PageButton>
          <p v-show="!isColorTheme"> Ночной режим</p>
          <p v-show="isColorTheme"> Дневной режим</p>
        </li>

      </ul>
    </transition-group>
  </div>
  {{ isTooltip }}

</template>

<script>
import IconTooltip from "@/components/icons/IconTooltip.vue";
import IconTooltipOff from "@/components/icons/IconTooltipOff.vue";
import IconSun from "@/components/icons/IconSun.vue";
import IconMoon from "@/components/icons/IconMoon.vue";
import PageButton from "@/components/UI/PageButton.vue";
import IconClose from "@/components/icons/IconClose.vue";

import { useKeyStore } from "@/stores/KeyStore";
import { mapState, mapActions } from "pinia";

export default {
  name: "PageMenu.vue",

  components: { IconTooltip, IconTooltipOff, IconSun, IconMoon, PageButton, IconClose },
  props: {
    isSettings: Boolean
  },

  data() {
    return {
      isTooltip: null,
      isColorTheme: null
    };
  },

  created() {
    this.isTooltip = this.getStoreKey()["isTooltip"];
    this.isColorTheme = this.getStoreKey()["isColorTheme"];

    console.log(this.isTooltip);
    console.log(this.isColorTheme);
  },

  computed: {
    ...mapState(useKeyStore, ["getStoreKey"])
  },

  methods: {
    ...mapActions(useKeyStore, ["setToggle"]),

    closeMenu() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.menu {
  position: absolute;
  bottom: 90px;
  right: 20px;

  width: 220px;
  background: var(--vt-c-white);
  box-shadow: 0 5px 20px var(--vt-c-grey-silver);
  border-radius: 20px;
  padding: 30px;
}

.menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  list-style: none;
  padding: 5px 10px;
}

.menu__close {
  position: absolute;
  top: 10px;
  right: 10px;
}

@media screen and  (max-width: 425px) {
  .menu {
    right: -10px;
  }
}
</style>
